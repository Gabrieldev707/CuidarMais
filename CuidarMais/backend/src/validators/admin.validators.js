const { z } = require('zod');

const gerarConviteSchema = z.object({
    email: z.string({ required_error: 'Email é obrigatório' }).email('Email inválido'),
});

const validarCodigoSchema = z.object({
    codigo: z.string({ required_error: 'Código é obrigatório' }).min(1, 'Código é obrigatório'),
});

module.exports = { gerarConviteSchema, validarCodigoSchema };
