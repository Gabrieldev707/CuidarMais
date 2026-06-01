const { z } = require('zod');

const gerarConviteSchema = z.object({
    email: z.string({ required_error: 'Email e obrigatorio' }).trim().email('Email invalido'),
});

const validarCodigoSchema = z.object({
    email: z.string({ required_error: 'Email e obrigatorio' }).trim().email('Email invalido'),
    codigo: z.string({ required_error: 'Codigo e obrigatorio' }).trim().min(1, 'Codigo e obrigatorio'),
});

module.exports = { gerarConviteSchema, validarCodigoSchema };
