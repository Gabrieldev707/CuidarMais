const jwt = require('jsonwebtoken');
const User = require('../models/User');

const gerarToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.register = async(req, res) => {
    try {
        const { nome, email, senha, telefone, role } = req.body;

        const usuarioExiste = await User.findOne({ email });
        if (usuarioExiste) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        const usuario = await User.create({ nome, email, senha, telefone, role });
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
        const { email, senha } = req.body;

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