const createApp = require('./src/app');
const connectDB = require('./src/config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function start() {
    const app = await createApp();

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`GraphQL disponível em http://localhost:${PORT}/graphql`);
    });

    // Conecta ao banco depois de já estar escutando
    await connectDB();
}

start();
