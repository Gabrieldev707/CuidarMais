const crypto = require('crypto')
const nodemailer = require('nodemailer')
const ConviteGestor = require('../models/ConviteGestor')
const User = require('../models/User')
const { DEMO_EMAILS } = require('../config/demo')

const normalizarEmail = (email) => email.trim().toLowerCase()
const normalizarSenhaEmail = (senha) => senha.replace(/\s+/g, '')
const mascararEmail = (email) => {
    const [usuario, dominio] = email.split('@')
    return `${usuario.slice(0, 1)}***@${dominio}`
}

let transporter

const lerBooleano = (valor, padrao) => {
    if (valor === undefined) return padrao
    return valor.trim().toLowerCase() === 'true'
}

const criarTransporter = () => {
    const usuario = process.env.EMAIL_USER?.trim()
    const senha = process.env.EMAIL_PASS
        ? normalizarSenhaEmail(process.env.EMAIL_PASS)
        : ''

    if (!usuario || !senha) {
        return null
    }

    const porta = Number(process.env.SMTP_PORT || 587)
    const rejeitarCertificadoInvalido = lerBooleano(
        process.env.SMTP_REJECT_UNAUTHORIZED,
        true
    )

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com',
        port: porta,
        secure: lerBooleano(process.env.SMTP_SECURE, porta === 465),
        auth: {
            user: usuario,
            pass: senha
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        tls: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: rejeitarCertificadoInvalido
        }
    })
}

const obterTransporter = () => {
    if (!transporter) {
        transporter = criarTransporter()
    }
    return transporter
}

const descreverErroEmail = (error) => {
    if (error.code === 'EAUTH' || error.responseCode === 535) {
        return 'Autenticacao do Gmail recusada. Verifique o email e a senha de aplicativo.'
    }

    if (/certificate/i.test(error.message || '')) {
        return 'Falha ao validar o certificado SMTP. Revise a configuracao TLS do ambiente.'
    }

    if (['ECONNECTION', 'ETIMEDOUT', 'ESOCKET'].includes(error.code)) {
        return 'Nao foi possivel conectar ao servidor de email. Tente novamente em instantes.'
    }

    if (error.code === 'EENVELOPE' || error.responseCode === 550) {
        return 'O servidor de email recusou o destinatario informado.'
    }

    return 'O convite foi criado, mas o servidor de email nao conseguiu envia-lo.'
}

const enviarEmailConvite = async({ email, codigo }) => {
    const emailTransporter = obterTransporter()

    if (!emailTransporter) {
        return { enviado: false, erro: 'Credenciais de email nao configuradas' }
    }

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173')
        .trim()
        .replace(/\/+$/, '')

    const info = await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM?.trim() || `"CuidarMais" <${process.env.EMAIL_USER.trim()}>`,
        to: email,
        subject: 'Seu convite para ser gestor no CuidarMais',
        text: [
            'Voce foi convidado para ser gestor no CuidarMais.',
            `Codigo: ${codigo}`,
            'O codigo expira em 48 horas.',
            `Cadastre-se em: ${frontendUrl}/cadastro`
        ].join('\n'),
        html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
          <h2 style="color: #80a6c6;">CuidarMais</h2>
          <p>Voce foi convidado para cadastrar sua casa de apoio na plataforma <strong>CuidarMais</strong>.</p>
          <p>Use o codigo abaixo para criar sua conta como gestor:</p>
          <div style="
            background: #f2e2cf;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            margin: 1.5rem 0;
          ">
            <span style="
              font-size: 2rem;
              font-weight: 800;
              letter-spacing: 6px;
              color: #395f7f;
            ">${codigo}</span>
          </div>
          <p style="color: #666; font-size: 0.9rem;">
            Este codigo expira em 48 horas. Acesse
            <a href="${frontendUrl}/cadastro" style="color: #80a6c6;">CuidarMais</a>
            e selecione "Gestor" para usar o codigo.
          </p>
          <p style="color: #999; font-size: 0.8rem;">
            Se voce nao esperava este email, pode ignorar.
          </p>
        </div>
      `
    })

    if (!info.accepted?.length || info.rejected?.length) {
        const error = new Error('Destinatario recusado pelo servidor SMTP')
        error.code = 'EENVELOPE'
        throw error
    }

    return { enviado: true, messageId: info.messageId }
}

exports.gerarConvite = async(req, res) => {
    try {
        const email = normalizarEmail(req.body.email)

        const usuarioExistente = await User.findOne({ email })
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Este email ja possui uma conta' })
        }

        await ConviteGestor.updateMany({ email, usado: false }, { usado: true })

        const codigo = crypto.randomBytes(4).toString('hex').toUpperCase()

        const convite = await ConviteGestor.create({
            email,
            codigo,
            criadoPor: req.usuario.id
        })

        let resultadoEmail
        try {
            resultadoEmail = await enviarEmailConvite({ email, codigo })
        } catch (error) {
            resultadoEmail = {
                enviado: false,
                erro: descreverErroEmail(error)
            }
            console.error('Erro ao enviar email de convite:', {
                code: error.code,
                command: error.command,
                responseCode: error.responseCode,
                message: error.message
            })
        }

        res.status(201).json({
            message: resultadoEmail.enviado ?
                `Convite enviado para ${email}` :
                `Convite gerado para ${email}, mas o email nao foi enviado. Use o codigo exibido no painel.`,
            codigo,
            convite,
            emailEnviado: resultadoEmail.enviado,
            emailErro: resultadoEmail.erro
        })
    } catch (error) {
        res.status(500).json({ message: 'Erro ao gerar convite', error: error.message })
    }
}

exports.listarConvites = async(req, res) => {
    try {
        const convites = await ConviteGestor.find()
            .populate('criadoPor', 'nome')
            .sort({ createdAt: -1 })

        const adminDemo = await User.exists({
            _id: req.usuario.id,
            email: DEMO_EMAILS.admin
        })

        if (adminDemo) {
            return res.json({
                convites: convites.map(convite => ({
                    ...convite.toObject(),
                    email: mascararEmail(convite.email),
                    codigo: '********'
                }))
            })
        }

        res.json({ convites })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}

exports.deletarConvite = async(req, res) => {
    try {
        await ConviteGestor.findByIdAndDelete(req.params.id)
        res.json({ message: 'Convite removido' })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}

exports.validarCodigo = async(req, res) => {
    try {
        const { email, codigo } = req.body

        const convite = await ConviteGestor.findOne({
            email: normalizarEmail(email),
            codigo: codigo.trim().toUpperCase(),
            usado: false,
            expiresAt: { $gt: new Date() }
        })

        if (!convite) {
            return res.status(400).json({ message: 'Codigo invalido ou expirado' })
        }

        res.json({ valido: true })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}

exports.getStats = async(req, res) => {
    try {
        const Casa = require('../models/Casa')
        const Visita = require('../models/Visita')

        const [usuarios, gestores, casas, visitas] = await Promise.all([
            User.countDocuments({ role: 'familia' }),
            User.countDocuments({ role: 'gestor' }),
            Casa.countDocuments({ ativo: true }),
            Visita.countDocuments()
        ])

        res.json({ stats: { usuarios, gestores, casas, visitas } })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}
