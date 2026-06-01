const { z } = require('zod');

const optionalTrimmedString = (schema) =>
    z.preprocess((value) => {
        if (typeof value !== 'string') return value;
        const trimmed = value.trim();
        return trimmed === '' ? undefined : trimmed;
    }, schema.optional());

const coordsSchema = z.object({
    lat: z.coerce.number({ required_error: 'Latitude e obrigatoria' }),
    lng: z.coerce.number({ required_error: 'Longitude e obrigatoria' }),
}).optional();

const enderecoSchema = z.object({
    rua: z.string().trim().min(3, 'Rua e obrigatoria'),
    numero: z.string().trim().min(1, 'Numero e obrigatorio'),
    bairro: z.string().trim().min(2, 'Bairro e obrigatorio'),
    cidade: z.string().trim().min(2, 'Cidade e obrigatoria'),
    estado: z.string().trim().length(2, 'Estado deve ter 2 letras').default('PB'),
    cep: z.string().trim().regex(/^\d{5}-?\d{3}$/, 'CEP invalido'),
    coords: coordsSchema,
});

const servicosEnum = z.enum([
    'enfermagem', 'fisioterapia', 'alimentacao', 'medicamentos', 'transporte', 'psicologia',
    'acompanhamento_medico', 'atividades_recreativas',
    'desintoxicacao', 'grupo_de_apoio', 'psiquiatria', 'reintegracao_social',
    'terapia_ocupacional', 'acompanhamento_psiquiatrico', 'oficinas_terapeuticas',
    'assistencia_social', 'capacitacao_profissional', 'apoio_juridico', 'documentacao',
]);

const criarCasaSchema = z.object({
    nome: z.string().trim().min(3, 'Nome deve ter ao menos 3 caracteres'),
    descricao: z.string().trim().min(10, 'Descricao deve ter ao menos 10 caracteres'),
    tipo: z.enum(['idosos', 'dependentes_quimicos', 'saude_mental', 'vulnerabilidade_social'], {
        error: () => ({ message: 'Tipo invalido' }),
    }),
    endereco: enderecoSchema,
    capacidade: z.coerce.number({ required_error: 'Capacidade e obrigatoria' }).int().min(1, 'Capacidade minima e 1'),
    vagasDisponiveis: z.coerce.number({ required_error: 'Vagas disponiveis sao obrigatorias' }).int().min(0),
    servicos: z.array(servicosEnum).optional(),
    telefone: optionalTrimmedString(z.string().min(10, 'Telefone invalido')),
    email: optionalTrimmedString(z.string().email('Email invalido')),
});

const atualizarCasaSchema = criarCasaSchema.partial();

const atualizarVagasSchema = z.object({
    vagasDisponiveis: z.coerce.number({ required_error: 'Vagas disponiveis sao obrigatorias' }).int().min(0),
});

module.exports = { criarCasaSchema, atualizarCasaSchema, atualizarVagasSchema };
