require('dotenv').config();

const mongoose = require('mongoose');
const createApp = require('./src/app');
const connectDB = require('./src/config/db');
const { validarAmbiente } = require('./src/config/env');

const PORT = process.env.PORT || 5000;

async function start() {
    try {
        validarAmbiente();
        await connectDB();

        const app = await createApp();
        const server = app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
            console.log(`GraphQL disponivel em http://localhost:${PORT}/graphql`);
        });

        const encerrar = async(signal) => {
            console.log(`${signal} recebido. Encerrando servidor...`);
            server.close(async() => {
                await mongoose.disconnect();
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => encerrar('SIGTERM'));
        process.on('SIGINT', () => encerrar('SIGINT'));
    } catch (error) {
        console.error('Falha ao iniciar a API:', error.message);
        process.exit(1);
    }
}

start();
