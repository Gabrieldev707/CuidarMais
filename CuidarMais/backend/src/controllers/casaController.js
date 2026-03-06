const Casa = require('../models/Casa');

exports.listarCasas = async (req, res) => {
  try {
    const { cidade, servico, vagas } = req.query;
    const filtro = { ativo: true };

    if (cidade) filtro['endereco.cidade'] = new RegExp(cidade, 'i');
    if (servico) filtro.servicos = servico;
    if (vagas === 'true') filtro.vagasDisponiveis = { $gt: 0 };

    const casas = await Casa.find(filtro).populate('gestorId', 'nome email telefone');
    res.json({ total: casas.length, casas });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

exports.buscarCasa = async (req, res) => {
  try {
    const casa = await Casa.findById(req.params.id).populate('gestorId', 'nome email telefone');
    if (!casa) return res.status(404).json({ message: 'Casa não encontrada' });
    res.json({ casa });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

exports.criarCasa = async (req, res) => {
  try {
    const casa = await Casa.create({
      ...req.body,
      gestorId: req.usuario.id
    });
    res.status(201).json({ message: 'Casa criada com sucesso', casa });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

exports.atualizarCasa = async (req, res) => {
  try {
    const casa = await Casa.findById(req.params.id);
    if (!casa) return res.status(404).json({ message: 'Casa não encontrada' });

    if (casa.gestorId.toString() !== req.usuario.id && req.usuario.role !== 'admin') {
      return res.status(403).json({ message: 'Sem permissão para editar esta casa' });
    }

    const casaAtualizada = await Casa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Casa atualizada com sucesso', casa: casaAtualizada });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

exports.deletarCasa = async (req, res) => {
  try {
    const casa = await Casa.findById(req.params.id);
    if (!casa) return res.status(404).json({ message: 'Casa não encontrada' });

    if (casa.gestorId.toString() !== req.usuario.id && req.usuario.role !== 'admin') {
      return res.status(403).json({ message: 'Sem permissão para deletar esta casa' });
    }

    await Casa.findByIdAndUpdate(req.params.id, { ativo: false });
    res.json({ message: 'Casa removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

exports.atualizarVagas = async (req, res) => {
  try {
    const { vagasDisponiveis } = req.body;
    const casa = await Casa.findById(req.params.id);
    if (!casa) return res.status(404).json({ message: 'Casa não encontrada' });

    if (casa.gestorId.toString() !== req.usuario.id) {
      return res.status(403).json({ message: 'Sem permissão' });
    }

    if (vagasDisponiveis > casa.capacidade) {
      return res.status(400).json({ message: 'Vagas não podem exceder a capacidade' });
    }

    casa.vagasDisponiveis = vagasDisponiveis;
    await casa.save();
    res.json({ message: 'Vagas atualizadas', vagasDisponiveis: casa.vagasDisponiveis });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};