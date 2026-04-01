const mongoose = require('mongoose')

const conviteGestorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    codigo: {
        type: String,
        required: true,
        unique: true
    },
    usado: {
        type: Boolean,
        default: false
    },
    criadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 horas
    }
}, { timestamps: true })

module.exports = mongoose.model('ConviteGestor', conviteGestorSchema)