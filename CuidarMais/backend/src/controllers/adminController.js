const crypto = require('crypto')
const nodemailer = require('nodemailer')
const ConviteGestor = require('../models/ConviteGestor')
const User = require('../models/User')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

exports.gerarConvite = async(req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: 'Email obrigatório' })
        }

        const usuarioExistente = await User.findOne({ email })
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Este email já possui uma conta' })
        }

        await ConviteGestor.updateMany({ email, usado: false }, { usado: true })

        const codigo = crypto.randomBytes(4).toString('hex').toUpperCase()

        await ConviteGestor.create({
            email,
            codigo,
            criadoPor: req.usuario.id
        })

        await transporter.sendMail({
            from: `"CuidarMais" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Seu convite para ser gestor no CuidarMais',
            html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
          <h2 style="color: #80a6c6;">CuidarMais</h2>
          <p>Você foi convidado para cadastrar sua casa de apoio na plataforma <strong>CuidarMais</strong>.</p>
          <p>Use o código abaixo para criar sua conta como gestor:</p>
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
            Este código expira em 48 horas. Acesse 
            <a href="http://localhost:5174/cadastro" style="color: #80a6c6;">CuidarMais</a> 
            e selecione "Gestor" para usar o código.
          </p>
          <p style="color: #999; font-size: 0.8rem;">
            Se você não esperava este email, pode ignorá-lo.
          </p>
        </div>
      `
        })

        res.status(201).json({
            message: `Convite enviado para ${email}`,
            codigo
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
        res.json({ convites })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}

exports.validarCodigo = async(req, res) => {
    try {
        const { email, codigo } = req.body

        const convite = await ConviteGestor.findOne({
            email: email.toLowerCase(),
            codigo: codigo.toUpperCase(),
            usado: false,
            expiresAt: { $gt: new Date() }
        })

        if (!convite) {
            return res.status(400).json({ message: 'Código inválido ou expirado' })
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