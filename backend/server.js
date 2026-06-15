require('dotenv').config();

const mongoose = require('mongoose');
const createApp = require('./src/app');
const connectDB = require('./src/config/db');
const { validarAmbiente } = require('./src/config/env');

const PORT = process.env.PORT || 5000;

const escutar = (app) => new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`GraphQL disponivel em http://localhost:${PORT}/graphql`);
        resolve(server);
    });

    server.once('error', reject);
});

async function start() {
    try {
        validarAmbiente();
        await connectDB();

        const app = await createApp();
        const server = await escutar(app);

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
        if (error.code === 'EADDRINUSE') {
            console.error(`Porta ${PORT} ja esta em uso. Encerre o processo antigo ou altere PORT no .env.`);
            process.exit(1);
        }

        console.error('Falha ao iniciar a API:', error.message);
        process.exit(1);
    }
}

start();
