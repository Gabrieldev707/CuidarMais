const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['familia', 'gestor', 'admin'],
        default: 'familia'
    },
    telefone: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: null
    },
    ativo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('senha')) return;
    this.senha = await bcrypt.hash(this.senha, 10);
});

userSchema.methods.compararSenha = async function(senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('User', userSchema);