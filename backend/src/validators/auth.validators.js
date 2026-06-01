const { z } = require('zod');

const registerSchema = z.object({
    nome: z.string().trim().min(3, 'Nome deve ter ao menos 3 caracteres'),
    email: z.string().trim().email('Email invalido'),
    senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    telefone: z.string().trim().min(10, 'Telefone invalido'),
    role: z.enum(['familia', 'gestor', 'admin']).optional(),
    codigoConvite: z.string().trim().optional(),
});

const loginSchema = z.object({
    email: z.string().trim().email('Email invalido'),
    senha: z.string().min(1, 'Senha e obrigatoria'),
});

module.exports = { registerSchema, loginSchema };
