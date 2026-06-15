const Visita = require('../models/Visita')
const Casa = require('../models/Casa')

exports.criarVisita = async (req, res) => {
  try {
    const visita = await Visita.create({
      ...req.body,
      responsavelId: req.usuario.id
    })
    res.status(201).json({ message: 'Visita agendada com sucesso', visita })
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message })
  }
}

exports.minhasVisitas = async (req, res) => {
  try {
    let filtro

    if (req.usuario.role === 'gestor') {
      const casas = await Casa.find({
        gestorId: req.usuario.id,
        ativo: true
      }).select('_id')
      filtro = { casaId: { $in: casas.map(casa => casa._id) } }
    } else if (req.usuario.role === 'familia') {
      filtro = { responsavelId: req.usuario.id }
    } else {
      return res.status(403).json({ message: 'Sem permissao para listar visitas' })
    }

    const visitas = await Visita.find(filtro)
      .populate('casaId', 'nome endereco tipo')
      .populate('responsavelId', 'nome email telefone')
      .sort({ createdAt: -1 })
    res.json({ visitas })
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message })
  }
}

exports.atualizarStatus = async (req, res) => {
  try {
    const { status } = req.body
    const visita = await Visita.findById(req.params.id).populate('casaId')
    if (!visita) return res.status(404).json({ message: 'Visita não encontrada' })

    if (!visita.casaId || visita.casaId.gestorId.toString() !== req.usuario.id) {
      return res.status(403).json({ message: 'Sem permissao para alterar esta visita' })
    }

    visita.status = status
    await visita.save()
    res.json({ message: 'Status atualizado', visita })
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message })
  }
}
