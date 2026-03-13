const { z } = require('zod');

const criarVisitaSchema = z.object({
    casaId: z.string({ required_error: 'casaId é obrigatório' }).min(1, 'casaId é obrigatório'),
    data: z.string({ required_error: 'Data é obrigatória' }).refine(
        (val) => !isNaN(Date.parse(val)),
        { message: 'Data inválida' }
    ),
    horario: z.string({ required_error: 'Horário é obrigatório' })
        .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:MM'),
    observacoes: z.string().max(500, 'Observações muito longas').optional(),
});

const atualizarStatusVisitaSchema = z.object({
    status: z.enum(['pendente', 'confirmada', 'cancelada', 'realizada'], {
        errorMap: () => ({ message: 'Status inválido. Use: pendente, confirmada, cancelada ou realizada' }),
    }),
});

module.exports = { criarVisitaSchema, atualizarStatusVisitaSchema };
