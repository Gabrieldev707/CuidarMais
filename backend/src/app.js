const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const jwt = require('jsonwebtoken');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const authRoutes = require('./routes/auth.routes');
const casaRoutes = require('./routes/casa.routes');
const visitaRoutes = require('./routes/visita.routes');
const assistidoRoutes = require('./routes/assistido.routes');
const candidaturaRoutes = require('./routes/candidatura.routes');
const adminRoutes = require('./routes/admin.routes');

const ORIGENS_FRONTEND_PADRAO = [
    'https://cuidarmais.vercel.app',
    'https://frontend-one-orcin-79.vercel.app'
];

const criarCorsOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const allowedOrigins = new Set(
        [
            ...ORIGENS_FRONTEND_PADRAO,
            ...(process.env.FRONTEND_URL || '').split(',')
        ]
            .map(origin => origin.trim().replace(/\/+$/, ''))
            .filter(Boolean)
    );

    const allowedPatterns = (process.env.CORS_ALLOWED_PATTERNS || '')
            .split(',')
            .map(pattern => pattern.trim())
            .filter(Boolean)
            .flatMap(pattern => {
                try {
                    return [new RegExp(pattern)];
                } catch {
                    console.warn(`CORS_ALLOWED_PATTERNS ignorado por regex invalido: ${pattern}`);
                    return [];
                }
            });

    if (!isProduction) {
        allowedOrigins.add('http://localhost:5173');
        allowedOrigins.add('http://localhost:5174');
        allowedOrigins.add('http://localhost:5175');
    }

    return {
        origin(origin, callback) {
            // Requisicoes sem Origin incluem healthchecks e clientes de API.
            if (!origin) return callback(null, true);

            const originNormalizada = origin.replace(/\/+$/, '');
            if (
                allowedOrigins.has(originNormalizada) ||
                allowedPatterns.some(pattern => pattern.test(originNormalizada))
            ) {
                return callback(null, true);
            }

            return callback(new Error(`Origin nao permitida pelo CORS: ${origin}`));
        },
        credentials: true
    };
};

async function createApp() {
    const app = express();
    const isProduction = process.env.NODE_ENV === 'production';
    const corsOptions = criarCorsOptions();

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: !isProduction
    });
    await apolloServer.start();

    app.disable('x-powered-by');
    app.use(isProduction ? helmet() : helmet({ contentSecurityPolicy: false }));
    app.use(cors(corsOptions));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    app.get('/', (req, res) => {
        res.json({ message: 'CuidarMais API rodando!' });
    });

    app.get('/health', (req, res) => {
        const bancoConectado = mongoose.connection.readyState === 1;
        res.status(bancoConectado ? 200 : 503).json({
            status: bancoConectado ? 'ok' : 'degraded',
            database: bancoConectado ? 'connected' : 'disconnected',
            uptime: Math.round(process.uptime())
        });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/casas', casaRoutes);
    app.use('/api/visitas', visitaRoutes);
    app.use('/api/assistidos', assistidoRoutes);
    app.use('/api/candidaturas', candidaturaRoutes);
    app.use('/api/admin', adminRoutes);

    app.use(
        '/graphql',
        cors(corsOptions),
        expressMiddleware(apolloServer, {
            context: async({ req }) => {
                const authHeader = req.headers.authorization || '';
                if (authHeader.startsWith('Bearer ')) {
                    const token = authHeader.split(' ')[1];
                    try {
                        const usuario = jwt.verify(token, process.env.JWT_SECRET);
                        return { usuario };
                    } catch {
                        // Queries publicas continuam disponiveis sem usuario autenticado.
                    }
                }
                return { usuario: null };
            },
        })
    );

    app.use((error, req, res, next) => {
        if (!error) return next();

        if (error.message?.startsWith('Origin nao permitida')) {
            return res.status(403).json({ message: error.message });
        }

        console.error('Erro nao tratado:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    });

    return app;
}

module.exports = createApp;
