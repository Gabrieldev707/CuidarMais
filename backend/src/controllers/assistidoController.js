const Assistido = require('../models/Assistido')
const Candidatura = require('../models/Candidatura')

exports.criarAssistido = async(req, res) => {
    try {
        const assistido = await Assistido.create({
            ...req.body,
            responsavelId: req.usuario.id
        })
        res.status(201).json({ message: 'Assistido cadastrado com sucesso', assistido })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}

exports.meuAssistido = async(req, res) => {
    try {
        const assistido = await Assistido.findOne({
            responsavelId: req.usuario.id,
            ativo: true
        })
        res.json({ assistido })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}

exports.atualizarAssistido = async(req, res) => {
    try {
        const assistido = await Assistido.findOneAndUpdate({ responsavelId: req.usuario.id, ativo: true },
            req.body, { new: true }
        )
        if (!assistido) return res.status(404).json({ message: 'Assistido não encontrado' })
        res.json({ message: 'Atualizado com sucesso', assistido })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}