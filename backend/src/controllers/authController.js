const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ConviteGestor = require('../models/ConviteGestor');

const normalizarEmail = (email) => email.trim().toLowerCase();

const gerarToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.register = async(req, res) => {
    try {
        const { nome, senha, telefone, role, codigoConvite } = req.body;
        const email = normalizarEmail(req.body.email);

        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        if (role === 'gestor') {
            if (!codigoConvite) {
                return res.status(400).json({ message: 'Código de convite obrigatório para gestores' });
            }

            const convite = await ConviteGestor.findOne({
                email,
                codigo: codigoConvite.trim().toUpperCase(),
                usado: false,
                expiresAt: { $gt: new Date() }
            });

            if (!convite) {
                return res.status(400).json({ message: 'Código de convite inválido ou expirado' });
            }

            req.conviteGestor = convite;
        }

        const roleSeguro = role === 'admin' ? 'familia' : (role || 'familia');

        const usuario = await User.create({ nome, email, senha, telefone, role: roleSeguro });

        if (req.conviteGestor) {
            req.conviteGestor.usado = true;
            await req.conviteGestor.save();
        }

        const token = gerarToken(usuario._id, usuario.role);

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

exports.login = async(req, res) => {
    try {
        const { senha } = req.body;
        const email = normalizarEmail(req.body.email);

        const usuario = await User.findOne({ email }).select('+senha');
        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        const senhaCorreta = await usuario.compararSenha(senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        const token = gerarToken(usuario._id, usuario.role);

        res.json({
            message: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

exports.perfil = async(req, res) => {
    try {
        const usuario = await User.findById(req.usuario.id);
        res.json({ usuario });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};
