const { z } = require('zod');

const criarVisitaSchema = z.object({
    casaId: z.string({ required_error: 'casaId é obrigatório' }).min(1, 'casaId é obrigatório'),
    data: z.string({ required_error: 'Data é obrigatória' })
        .refine((val) => !isNaN(Date.parse(val)), { message: 'Data inválida' })
        .refine((val) => {
            const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
            return new Date(val) >= hoje;
        }, { message: 'A data da visita não pode ser no passado' }),
    horario: z.enum(['manha', 'tarde'], {
        error: () => ({ message: 'Horário deve ser "manha" ou "tarde"' }),
    }),
    observacoes: z.string().max(2000, 'Observações muito longas').optional(),
});

const atualizarStatusVisitaSchema = z.object({
    status: z.enum(['pendente', 'confirmada', 'cancelada', 'realizada'], {
        error: () => ({ message: 'Status inválido. Use: pendente, confirmada, cancelada ou realizada' }),
    }),
});

module.exports = { criarVisitaSchema, atualizarStatusVisitaSchema };
