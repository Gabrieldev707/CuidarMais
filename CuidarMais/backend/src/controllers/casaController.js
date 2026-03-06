const Casa = require('../models/Casa');

// Converte endereço em coordenadas usando Nominatim (OpenStreetMap) - gratuito
const geocodificarEndereco = async(endereco) => {
    try {
        const query = `${endereco.rua}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}, Brasil`
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`

        const response = await fetch(url, {
            headers: { 'User-Agent': 'CuidarMais/1.0' }
        })
        const data = await response.json()

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            }
        }

        // Fallback: tenta só com CEP
        if (endereco.cep) {
            const urlCep = `https://nominatim.openstreetmap.org/search?format=json&q=${endereco.cep}&limit=1`
            const resCep = await fetch(urlCep, { headers: { 'User-Agent': 'CuidarMais/1.0' } })
            const dataCep = await resCep.json()
            if (dataCep && dataCep.length > 0) {
                return {
                    lat: parseFloat(dataCep[0].lat),
                    lng: parseFloat(dataCep[0].lon)
                }
            }
        }

        return null
    } catch (error) {
        console.error('Erro na geocodificação:', error)
        return null
    }
}

exports.listarCasas = async(req, res) => {
    try {
        const { cidade, servico, vagas, tipo } = req.query;
        const filtro = { ativo: true };

        if (cidade) filtro['endereco.cidade'] = new RegExp(cidade, 'i');
        if (servico) filtro.servicos = servico;
        if (vagas === 'true') filtro.vagasDisponiveis = { $gt: 0 };
        if (tipo) filtro.tipo = tipo;

        const casas = await Casa.find(filtro).populate('gestorId', 'nome email telefone');
        res.json({ total: casas.length, casas });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

exports.buscarCasa = async(req, res) => {
    try {
        const casa = await Casa.findById(req.params.id).populate('gestorId', 'nome email telefone');
        if (!casa) return res.status(404).json({ message: 'Casa não encontrada' });
        res.json({ casa });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

exports.criarCasa = async(req, res) => {
    try {
        const dados = {...req.body, gestorId: req.usuario.id }

        // Geocodificação automática se não tiver coordenadas
        if (dados.endereco && (!dados.endereco.coords || !dados.endereco.coords.lat || !dados.endereco.coords.lng)) {
            const coords = await geocodificarEndereco(dados.endereco)
            if (coords) {
                dados.endereco.coords = coords
                console.log(`Coordenadas encontradas: ${coords.lat}, ${coords.lng}`)
            } else {
                console.warn('Não foi possível geocodificar o endereço')
            }
        }

        const casa = await Casa.create(dados)
        res.status(201).json({ message: 'Casa criada com sucesso', casa });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

exports.atualizarCasa = async(req, res) => {
    try {
        const casa = await Casa.findById(req.params.id);
        if (!casa) return res.status(404).json({ message: 'Casa não encontrada' });

        if (casa.gestorId.toString() !== req.usuario.id && req.usuario.role !== 'admin') {
            return res.status(403).json({ message: 'Sem permissão para editar esta casa' });
        }

        // Re-geocodifica se o endereço foi alterado
        if (req.body.endereco) {
            const coords = await geocodificarEndereco(req.body.endereco)
            if (coords) req.body.endereco.coords = coords
        }

        const casaAtualizada = await Casa.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Casa atualizada com sucesso', casa: casaAtualizada });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

exports.deletarCasa = async(req, res) => {
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

exports.atualizarVagas = async(req, res) => {
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