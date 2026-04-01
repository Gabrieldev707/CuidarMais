const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
    casaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Casa',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nota: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comentario: {
        type: String,
        trim: true
    },
    visitaConfirmada: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Avaliacao', avaliacaoSchema);