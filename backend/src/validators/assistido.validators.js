const { z } = require('zod');

const contatoEmergenciaSchema = z.object({
    nome: z.string().min(2, 'Nome do contato é obrigatório'),
    telefone: z.string().min(10, 'Telefone do contato inválido'),
    parentesco: z.string().min(2, 'Parentesco é obrigatório'),
}).optional();

const criarAssistidoSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
    dataNascimento: z.string({ required_error: 'Data de nascimento é obrigatória' })
        .refine((val) => !isNaN(Date.parse(val)), { message: 'Data de nascimento inválida' })
        .refine((val) => new Date(val) <= new Date(), { message: 'Data de nascimento não pode ser no futuro' }),
    perfil: z.enum(['idoso', 'dependente_quimico', 'saude_mental', 'vulnerabilidade_social'], {
        error: () => ({ message: 'Perfil inválido' }),
    }),
    dependencia: z.enum(['independente', 'parcial', 'total']).optional(),
    condicoes: z.array(z.string()).optional(),
    observacoes: z.string().max(1000, 'Observações muito longas').optional(),
    contatoEmergencia: contatoEmergenciaSchema,
});

const atualizarAssistidoSchema = criarAssistidoSchema.partial();

module.exports = { criarAssistidoSchema, atualizarAssistidoSchema };
