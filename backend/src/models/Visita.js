const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
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
    data: {
        type: Date,
        required: true
    },
    horario: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'confirmada', 'cancelada', 'realizada'],
        default: 'pendente'
    },
    observacoes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Visita', visitaSchema);