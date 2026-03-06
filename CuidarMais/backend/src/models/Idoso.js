const mongoose = require('mongoose');

const assistidoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    dataNascimento: {
        type: Date,
        required: true
    },
    perfil: {
        type: String,
        enum: ['idoso', 'dependente_quimico', 'saude_mental', 'vulnerabilidade_social'],
        required: true
    },
    responsavelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    casaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Casa',
        default: null
    },
    dependencia: {
        type: String,
        enum: ['independente', 'parcial', 'total'],
        default: 'parcial'
    },
    condicoes: [{ type: String }],
    observacoes: { type: String },
    foto: { type: String, default: null },
    ativo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Assistido', assistidoSchema);