const mongoose = require('mongoose');

const casaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    descricao: {
        type: String,
        required: [true, 'Descrição é obrigatória']
    },
    tipo: {
        type: String,
        enum: ['idosos', 'dependentes_quimicos', 'saude_mental', 'vulnerabilidade_social'],
        required: [true, 'Tipo é obrigatório']
    },
    endereco: {
        rua: { type: String, required: true },
        numero: { type: String, required: true },
        bairro: { type: String, required: true },
        cidade: { type: String, required: true },
        estado: { type: String, default: 'PB' },
        cep: { type: String, required: true },
        coords: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    fotos: [{ type: String }],
    capacidade: {
        type: Number,
        required: true,
        min: 1
    },
    vagasDisponiveis: {
        type: Number,
        required: true,
        min: 0
    },
    servicos: [{
        type: String,
        enum: [
            // Gerais
            'enfermagem',
            'fisioterapia',
            'alimentacao',
            'medicamentos',
            'transporte',
            'psicologia',
            // Idosos
            'acompanhamento_medico',
            'atividades_recreativas',
            // Dependência química
            'desintoxicacao',
            'grupo_de_apoio',
            'psiquiatria',
            'reintegracao_social',
            // Saúde mental
            'terapia_ocupacional',
            'acompanhamento_psiquiatrico',
            'oficinas_terapeuticas',
            // Vulnerabilidade social
            'assistencia_social',
            'capacitacao_profissional',
            'apoio_juridico',
            'documentacao'
        ]
    }],
    gestorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    telefone: { type: String },
    email: { type: String },
    avaliacaoMedia: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalAvaliacoes: {
        type: Number,
        default: 0
    },
    ativo: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Casa', casaSchema);