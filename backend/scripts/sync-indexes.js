require('dotenv').config()

const mongoose = require('mongoose')
const connectDB = require('../src/config/db')
const User = require('../src/models/User')
const Assistido = require('../src/models/Assistido')
const Casa = require('../src/models/Casa')
const Candidatura = require('../src/models/Candidatura')
const Visita = require('../src/models/Visita')
const ConviteGestor = require('../src/models/ConviteGestor')
const Avaliacao = require('../src/models/Avaliacao')

const sync = async() => {
    await connectDB()

    const gestoresDuplicados = await Casa.aggregate([
        { $group: { _id: '$gestorId', total: { $sum: 1 }, casas: { $push: '$nome' } } },
        { $match: { total: { $gt: 1 } } }
    ])

    if (gestoresDuplicados.length) {
        console.error('Indices nao sincronizados. Existem gestores com mais de uma casa:')
        gestoresDuplicados.forEach(item => {
            console.error(`- gestor ${item._id}: ${item.casas.join(', ')}`)
        })
        throw new Error('Resolva as duplicidades antes de sincronizar os indices')
    }

    const models = [
        User,
        Assistido,
        Casa,
        Candidatura,
        Visita,
        ConviteGestor,
        Avaliacao
    ]

    for (const model of models) {
        await model.syncIndexes()
        console.log(`Indices sincronizados: ${model.modelName}`)
    }
}

sync()
    .catch(error => {
        console.error('Erro ao sincronizar indices:', error.message)
        process.exitCode = 1
    })
    .finally(async() => {
        await mongoose.disconnect()
    })
