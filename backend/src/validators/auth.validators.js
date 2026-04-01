const { z } = require('zod');

const registerSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    telefone: z.string().min(10, 'Telefone inválido'),
    role: z.enum(['familia', 'gestor', 'admin']).optional(),
    codigoConvite: z.string().optional(),
});

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    senha: z.string().min(1, 'Senha é obrigatória'),
});

module.exports = { registerSchema, loginSchema };