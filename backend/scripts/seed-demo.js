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
        nome: 'Familia Demonstracao',
        role: 'familia',
        telefone: '(83) 99999-1001'
    })

    const gestor = await atualizarUsuario({
        email: DEMO_EMAILS.gestor,
        nome: 'Gestor Demonstracao',
        role: 'gestor',
        telefone: '(83) 99999-1002'
    })

    await atualizarUsuario({
        email: DEMO_EMAILS.admin,
        nome: 'Administrador Demonstracao',
        role: 'admin',
        telefone: '(83) 99999-1003'
    })

    await Assistido.findOneAndUpdate(
        { responsavelId: familia._id },
        {
            nome: 'Assistido Demonstracao',
            dataNascimento: new Date('1950-05-15'),
            perfil: 'idoso',
            responsavelId: familia._id,
            dependencia: 'parcial',
            condicoes: ['hipertensao'],
            observacoes: 'Perfil criado exclusivamente para demonstracao.',
            contatoEmergencia: {
                nome: 'Familia Demonstracao',
                telefone: '(83) 99999-1001',
                parentesco: 'Responsavel'
            },
            ativo: true
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    await Casa.findOneAndUpdate(
        { gestorId: gestor._id },
        {
            nome: 'Casa CuidarMais Demonstracao',
            descricao: 'Casa ficticia usada para demonstrar o painel do gestor.',
            tipo: 'idosos',
            endereco: {
                rua: 'Rua das Flores',
                numero: '100',
                bairro: 'Centro',
                cidade: 'Campina Grande',
                estado: 'PB',
                cep: '58400-000',
                coords: {
                    lat: -7.23072,
                    lng: -35.88167
                }
            },
            capacidade: 20,
            vagasDisponiveis: 5,
            servicos: ['enfermagem', 'alimentacao', 'medicamentos'],
            gestorId: gestor._id,
            telefone: '(83) 99999-1002',
            email: DEMO_EMAILS.gestor,
            ativo: true
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    console.log('Contas de demonstracao atualizadas com sucesso:')
    console.log(`Familia: ${DEMO_EMAILS.familia}`)
    console.log(`Gestor: ${DEMO_EMAILS.gestor}`)
    console.log(`Admin: ${DEMO_EMAILS.admin} (somente leitura)`)
}

seed()
    .catch(error => {
        console.error('Erro ao criar dados de demonstracao:', error.message)
        process.exitCode = 1
    })
    .finally(async() => {
        await mongoose.disconnect()
    })
