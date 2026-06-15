const User = require('../models/User')
const Assistido = require('../models/Assistido')
const Casa = require('../models/Casa')
const { DEMO_EMAILS, DEMO_PASSWORD } = require('../config/demo')

const CONTAS_TESTE = {
    [DEMO_EMAILS.familia]: {
        usuario: {
            nome: 'Ana Paula Santos',
            role: 'familia',
            telefone: '(83) 98842-3011'
        },
        assistido: {
            nome: 'Maria Jose Santos',
            dataNascimento: new Date('1948-05-15'),
            perfil: 'idoso',
            dependencia: 'parcial',
            condicoes: ['hipertensao', 'diabetes_tipo_2'],
            observacoes: 'Necessita acompanhamento para medicacao diaria, afericao de pressao e apoio em deslocamentos.',
            contatoEmergencia: {
                nome: 'Ana Paula Santos',
                telefone: '(83) 98842-3011',
                parentesco: 'Filha'
            },
            ativo: true
        }
    },
    [DEMO_EMAILS.gestor]: {
        usuario: {
            nome: 'Roberto Almeida',
            role: 'gestor',
            telefone: '(83) 98831-2044'
        },
        casa: {
            nome: 'Casa Esperanca Campina Grande',
            descricao: 'Casa de apoio para idosos com acompanhamento multiprofissional, alimentacao assistida e atividades de convivencia.',
            tipo: 'idosos',
            endereco: {
                rua: 'Avenida Floriano Peixoto',
                numero: '1450',
                bairro: 'Centro',
                cidade: 'Campina Grande',
                estado: 'PB',
                cep: '58400-165',
                coords: {
                    lat: -7.2219,
                    lng: -35.8817
                }
            },
            capacidade: 32,
            vagasDisponiveis: 8,
            servicos: ['enfermagem', 'alimentacao', 'medicamentos', 'fisioterapia', 'atividades_recreativas'],
            telefone: '(83) 98831-2044',
            email: DEMO_EMAILS.gestor,
            ativo: true
        }
    },
    [DEMO_EMAILS.admin]: {
        usuario: {
            nome: 'Carla Menezes',
            role: 'admin',
            telefone: '(83) 98875-1190'
        }
    }
}

const obterDadosContaTeste = (email) => CONTAS_TESTE[email]

const salvarUsuarioTeste = async(email, dados) => {
    let usuario = await User.findOne({ email }).select('+senha')

    if (!usuario) {
        usuario = new User({
            ...dados.usuario,
            email,
            senha: DEMO_PASSWORD,
            ativo: true
        })
    } else {
        usuario.nome = dados.usuario.nome
        usuario.role = dados.usuario.role
        usuario.telefone = dados.usuario.telefone
        usuario.ativo = true
        usuario.senha = DEMO_PASSWORD
    }

    await usuario.save()
    return usuario
}

const provisionarContaTeste = async(email, senha) => {
    if (senha !== DEMO_PASSWORD) return null

    const dados = obterDadosContaTeste(email)
    if (!dados) return null

    const usuario = await salvarUsuarioTeste(email, dados)

    if (dados.assistido) {
        await Assistido.findOneAndUpdate(
            { responsavelId: usuario._id },
            {
                ...dados.assistido,
                responsavelId: usuario._id
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
    }

    if (dados.casa) {
        await Casa.findOneAndUpdate(
            { gestorId: usuario._id },
            {
                ...dados.casa,
                gestorId: usuario._id
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
    }

    return usuario
}

const provisionarTodasContasTeste = async() => {
    const usuarios = []

    for (const email of Object.keys(CONTAS_TESTE)) {
        usuarios.push(await provisionarContaTeste(email, DEMO_PASSWORD))
    }

    return usuarios
}

module.exports = {
    provisionarContaTeste,
    provisionarTodasContasTeste
}
