const { z } = require('zod');

const contatoEmergenciaSchema = z.preprocess((value) => {
    if (!value || typeof value !== 'object') return undefined;

    const contato = {
        nome: typeof value.nome === 'string' ? value.nome.trim() : value.nome,
        telefone: typeof value.telefone === 'string' ? value.telefone.trim() : value.telefone,
        parentesco: typeof value.parentesco === 'string' ? value.parentesco.trim() : value.parentesco,
    };

    const vazio = !contato.nome && !contato.telefone && !contato.parentesco;
    return vazio ? undefined : contato;
}, z.object({
    nome: z.string().min(2, 'Nome do contato e obrigatorio'),
    telefone: z.string().min(10, 'Telefone do contato invalido'),
    parentesco: z.string().min(2, 'Parentesco e obrigatorio'),
}).optional());

const criarAssistidoSchema = z.object({
    nome: z.string().trim().min(3, 'Nome deve ter ao menos 3 caracteres'),
    dataNascimento: z.string({ required_error: 'Data de nascimento e obrigatoria' })
        .refine((val) => !isNaN(Date.parse(val)), { message: 'Data de nascimento invalida' })
        .refine((val) => new Date(val) <= new Date(), { message: 'Data de nascimento nao pode ser no futuro' }),
    perfil: z.enum(['idoso', 'dependente_quimico', 'saude_mental', 'vulnerabilidade_social'], {
        error: () => ({ message: 'Perfil invalido' }),
    }),
    dependencia: z.enum(['independente', 'parcial', 'total']).optional(),
    condicoes: z.array(z.string()).optional(),
    observacoes: z.string().max(1000, 'Observacoes muito longas').optional(),
    contatoEmergencia: contatoEmergenciaSchema,
});

const atualizarAssistidoSchema = criarAssistidoSchema.partial();

module.exports = { criarAssistidoSchema, atualizarAssistidoSchema };
