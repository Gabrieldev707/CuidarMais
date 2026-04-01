const Candidatura = require('../models/Candidatura')
const Casa = require('../models/Casa')
const Assistido = require('../models/Assistido')

exports.enviarCandidatura = async(req, res) => {
    try {
        const { assistidoId, casaId, mensagem } = req.body

        // Verifica se a casa existe e tem vagas
        const casa = await Casa.findById(casaId)
        if (!casa) return res.status(404).json({ message: 'Casa não encontrada' })
        if (casa.vagasDisponiveis === 0) {
            return res.status(400).json({ message: 'Casa sem vagas disponíveis' })
        }

        // Verifica se já tem candidatura pendente/em análise para essa casa
        const candidaturaExistente = await Candidatura.findOne({
            assistidoId,
            casaId,
            status: { $in: ['pendente', 'em_analise'] }
        })
        if (candidaturaExistente) {
            return res.status(400).json({ message: 'Já existe uma candidatura ativa para esta casa' })
        }

        const candidatura = await Candidatura.create({
            assistidoId,
            casaId,
            responsavelId: req.usuario.id,
            mensagem
        })

        await candidatura.populate([
            { path: 'casaId', select: 'nome endereco tipo' },
            { path: 'assistidoId', select: 'nome perfil' }
        ])

        res.status(201).json({ message: 'Candidatura enviada com sucesso', candidatura })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}

exports.minhasCandidaturas = async(req, res) => {
    try {
        const candidaturas = await Candidatura.find({ responsavelId: req.usuario.id })
            .populate('casaId', 'nome endereco tipo avaliacaoMedia')
            .populate('assistidoId', 'nome perfil')
            .sort({ createdAt: -1 })
        res.json({ candidaturas })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}

// Para o gestor responder
exports.responderCandidatura = async(req, res) => {
    try {
        const { status, respostaGestor } = req.body
        const candidatura = await Candidatura.findById(req.params.id)
            .populate('casaId')

        if (!candidatura) return res.status(404).json({ message: 'Candidatura não encontrada' })

        // Verifica se o gestor é dono da casa
        if (candidatura.casaId.gestorId.toString() !== req.usuario.id) {
            return res.status(403).json({ message: 'Sem permissão' })
        }

        candidatura.status = status
        candidatura.respostaGestor = respostaGestor
        candidatura.dataResposta = new Date()
        await candidatura.save()

        res.json({ message: 'Candidatura respondida', candidatura })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}

// Para o gestor listar candidaturas das suas casas
exports.candidaturasDaCasa = async(req, res) => {
    try {
        const candidaturas = await Candidatura.find({ casaId: req.params.casaId })
            .populate('assistidoId', 'nome perfil dependencia condicoes observacoes contatoEmergencia dataNascimento')
            .populate('responsavelId', 'nome telefone email')
            .sort({ createdAt: -1 })
        res.json({ candidaturas })
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message })
    }
}