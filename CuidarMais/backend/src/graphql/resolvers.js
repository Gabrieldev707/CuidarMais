const Casa = require('../models/Casa');
const Visita = require('../models/Visita');
const Candidatura = require('../models/Candidatura');

const resolvers = {
    Query: {
        casas: async (_, { cidade, tipo, servico, apenasComVagas }) => {
            const filtro = { ativo: true };
            if (cidade) filtro['endereco.cidade'] = new RegExp(cidade, 'i');
            if (tipo) filtro.tipo = tipo;
            if (servico) filtro.servicos = servico;
            if (apenasComVagas) filtro.vagasDisponiveis = { $gt: 0 };

            const casas = await Casa.find(filtro).populate('gestorId', 'nome email telefone');
            return casas;
        },

        casa: async (_, { id }) => {
            const casa = await Casa.findById(id).populate('gestorId', 'nome email telefone');
            return casa;
        },

        minhasVisitas: async (_, __, { usuario }) => {
            if (!usuario) throw new Error('Não autenticado');
            const visitas = await Visita.find({ responsavelId: usuario.id })
                .populate('casaId')
                .sort({ createdAt: -1 });
            return visitas;
        },

        minhasCandidaturas: async (_, __, { usuario }) => {
            if (!usuario) throw new Error('Não autenticado');
            const candidaturas = await Candidatura.find({ responsavelId: usuario.id })
                .sort({ createdAt: -1 });
            return candidaturas;
        },
    },

    Mutation: {
        agendarVisita: async (_, { casaId, data, horario, observacoes }, { usuario }) => {
            if (!usuario) throw new Error('Não autenticado');
            const visita = await Visita.create({
                casaId,
                data,
                horario,
                observacoes,
                responsavelId: usuario.id,
            });
            await visita.populate('casaId');
            return visita;
        },

        cancelarVisita: async (_, { id }, { usuario }) => {
            if (!usuario) throw new Error('Não autenticado');
            const visita = await Visita.findById(id);
            if (!visita) throw new Error('Visita não encontrada');
            if (visita.responsavelId.toString() !== usuario.id) {
                throw new Error('Sem permissão para cancelar esta visita');
            }
            visita.status = 'cancelada';
            await visita.save();
            await visita.populate('casaId');
            return visita;
        },
    },

    // Resolver de campo: mapeia _id do Mongo para id no GraphQL
    Casa: {
        id: (parent) => parent._id.toString(),
        gestor: (parent) => parent.gestorId,
    },

    Visita: {
        id: (parent) => parent._id.toString(),
        casa: (parent) => parent.casaId,
        createdAt: (parent) => parent.createdAt?.toISOString(),
    },

    Candidatura: {
        id: (parent) => parent._id.toString(),
        createdAt: (parent) => parent.createdAt?.toISOString(),
        dataResposta: (parent) => parent.dataResposta?.toISOString() ?? null,
    },

    Gestor: {
        id: (parent) => parent._id.toString(),
    },
};

module.exports = resolvers;
