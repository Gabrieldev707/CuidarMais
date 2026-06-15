require('dotenv').config()

const mongoose = require('mongoose')
const connectDB = require('../src/config/db')
const User = require('../src/models/User')
const Assistido = require('../src/models/Assistido')
const Casa = require('../src/models/Casa')
const { DEMO_EMAILS, DEMO_PASSWORD } = require('../src/config/demo')

const atualizarUsuario = async({ email, nome, role, telefone }) => {
    let usuario = await User.findOne({ email }).select('+senha')

    if (!usuario) {
        usuario = new User({ email, nome, role, telefone, senha: DEMO_PASSWORD })
    } else {
        usuario.nome = nome
        usuario.role = role
        usuario.telefone = telefone
        usuario.ativo = true
        usuario.senha = DEMO_PASSWORD
    }

    await usuario.save()
    return usuario
}

const seed = async() => {
    await connectDB()

    const familia = await atualizarUsuario({
        email: DEMO_EMAILS.familia,
        nome: 'Ana Paula Santos',
        role: 'familia',
        telefone: '(83) 98842-3011'
    })

    const gestor = await atualizarUsuario({
        email: DEMO_EMAILS.gestor,
        nome: 'Roberto Almeida',
        role: 'gestor',
        telefone: '(83) 98831-2044'
    })

    await atualizarUsuario({
        email: DEMO_EMAILS.admin,
        nome: 'Carla Menezes',
        role: 'admin',
        telefone: '(83) 98875-1190'
    })

    await Assistido.findOneAndUpdate(
        { responsavelId: familia._id },
        {
            nome: 'Maria Jose Santos',
            dataNascimento: new Date('1948-05-15'),
            perfil: 'idoso',
            responsavelId: familia._id,
            dependencia: 'parcial',
            condicoes: ['hipertensao', 'diabetes_tipo_2'],
            observacoes: 'Necessita acompanhamento para medicacao diaria, afericao de pressao e apoio em deslocamentos.',
            contatoEmergencia: {
                nome: 'Ana Paula Santos',
                telefone: '(83) 98842-3011',
                parentesco: 'Filha'
            },
            ativo: true
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    await Casa.findOneAndUpdate(
        { gestorId: gestor._id },
        {
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
            gestorId: gestor._id,
            telefone: '(83) 98831-2044',
            email: DEMO_EMAILS.gestor,
            ativo: true
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    console.log('Contas de teste atualizadas com sucesso:')
    console.log(`Familia: ${DEMO_EMAILS.familia}`)
    console.log(`Gestor: ${DEMO_EMAILS.gestor}`)
    console.log(`Admin: ${DEMO_EMAILS.admin} (somente leitura)`)
}

seed()
    .catch(error => {
        console.error('Erro ao criar dados de teste:', error.message)
        process.exitCode = 1
    })
    .finally(async() => {
        await mongoose.disconnect()
    })
