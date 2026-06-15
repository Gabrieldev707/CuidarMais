require('dotenv').config()

const mongoose = require('mongoose')
const connectDB = require('../src/config/db')
const { DEMO_EMAILS, DEMO_PASSWORD } = require('../src/config/demo')
const { provisionarTodasContasTeste } = require('../src/services/testAccounts')

const seed = async() => {
    await connectDB()
    await provisionarTodasContasTeste()

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
