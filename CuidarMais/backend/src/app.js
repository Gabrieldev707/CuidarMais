const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const casaRoutes = require('./routes/casa.routes');

const app = express();

// Middlewares globais
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.get('/', (req, res) => {
    res.json({ message: 'CuidarMais API rodando!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/casas', casaRoutes);

module.exports = app;