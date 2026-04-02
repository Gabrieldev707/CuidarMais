const { z } = require('zod');

const enderecoSchema = z.object({
    rua: z.string().min(3, 'Rua é obrigatória'),
    numero: z.string().min(1, 'Número é obrigatório'),
    bairro: z.string().min(2, 'Bairro é obrigatório'),
    cidade: z.string().min(2, 'Cidade é obrigatória'),
    estado: z.string().length(2, 'Estado deve ter 2 letras').default('PB'),
    cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
    coords: z.object({
        lat: z.number({ required_error: 'Latitude é obrigatória' }),
        lng: z.number({ required_error: 'Longitude é obrigatória' }),
    }),
});

const servicosEnum = z.enum([
    'enfermagem', 'fisioterapia', 'alimentacao', 'medicamentos', 'transporte', 'psicologia',
    'acompanhamento_medico', 'atividades_recreativas',
    'desintoxicacao', 'grupo_de_apoio', 'psiquiatria', 'reintegracao_social',
    'terapia_ocupacional', 'acompanhamento_psiquiatrico', 'oficinas_terapeuticas',
    'assistencia_social', 'capacitacao_profissional', 'apoio_juridico', 'documentacao',
]);

const criarCasaSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
    descricao: z.string().min(10, 'Descrição deve ter ao menos 10 caracteres'),
    tipo: z.enum(['idosos', 'dependentes_quimicos', 'saude_mental', 'vulnerabilidade_social'], {
        error: () => ({ message: 'Tipo inválido' }),
    }),
    endereco: enderecoSchema,
    capacidade: z.number({ required_error: 'Capacidade é obrigatória' }).int().min(1, 'Capacidade mínima é 1'),
    vagasDisponiveis: z.number({ required_error: 'Vagas disponíveis são obrigatórias' }).int().min(0),
    servicos: z.array(servicosEnum).min(1, 'Informe ao menos um serviço').optional(),
    telefone: z.string().min(10, 'Telefone inválido').optional(),
    email: z.string().email('Email inválido').optional(),
});

const atualizarCasaSchema = criarCasaSchema.partial();

const atualizarVagasSchema = z.object({
    vagasDisponiveis: z.number({ required_error: 'Vagas disponíveis são obrigatórias' }).int().min(0),
});

module.exports = { criarCasaSchema, atualizarCasaSchema, atualizarVagasSchema };
