const Visita = require('../models/Visita');

exports.criarVisita = async(req, res) => {
    try {
        const visita = await Visita.create({
            ...req.body,
            responsavelId: req.usuario.id
        });
        res.status(201).json({ message: 'Visita agendada com sucesso', visita });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

exports.minhasVisitas = async(req, res) => {
    try {
        const visitas = await Visita.find({ responsavelId: req.usuario.id })
            .populate('casaId', 'nome endereco')
            .sort({ createdAt: -1 });
        res.json({ visitas });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

exports.atualizarStatus = async(req, res) => {
    try {
        const visita = await Visita.findByIdAndUpdate(
            req.params.id, { status: req.body.status }, { new: true }
        );
        if (!visita) return res.status(404).json({ message: 'Visita não encontrada' });
        res.json({ message: 'Status atualizado', visita });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};