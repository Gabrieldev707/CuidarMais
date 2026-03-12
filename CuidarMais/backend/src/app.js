const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth.routes');
const casaRoutes = require('./routes/casa.routes');
const visitaRoutes = require('./routes/visita.routes');
const assistidoRoutes = require('./routes/assistido.routes');
const candidaturaRoutes = require('./routes/candidatura.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'CuidarMais API rodando!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/casas', casaRoutes);
app.use('/api/visitas', visitaRoutes);
app.use('/api/assistidos', assistidoRoutes);
app.use('/api/candidaturas', candidaturaRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;