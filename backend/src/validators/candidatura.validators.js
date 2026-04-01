const { z } = require('zod');

const enviarCandidaturaSchema = z.object({
    assistidoId: z.string({ required_error: 'assistidoId é obrigatório' }).min(1),
    casaId: z.string({ required_error: 'casaId é obrigatório' }).min(1),
    mensagem: z.string().max(1000, 'Mensagem muito longa').optional(),
});

const responderCandidaturaSchema = z.object({
    status: z.enum(['aceita', 'recusada'], {
        errorMap: () => ({ message: 'Status deve ser "aceita" ou "recusada"' }),
    }),
    respostaGestor: z.string().max(500, 'Resposta muito longa').optional(),
});

module.exports = { enviarCandidaturaSchema, responderCandidaturaSchema };
