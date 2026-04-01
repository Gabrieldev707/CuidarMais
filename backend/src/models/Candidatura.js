const mongoose = require('mongoose');

const candidaturaSchema = new mongoose.Schema({
    assistidoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assistido',
        required: true
    },
    casaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Casa',
        required: true
    },
    responsavelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'em_analise', 'aceita', 'recusada'],
        default: 'pendente'
    },
    mensagem: { type: String },
    respostaGestor: { type: String },
    dataResposta: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Candidatura', candidaturaSchema);