# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `CuidarMais/` (the inner directory):

```bash
npm run dev          # start backend + frontend together (concurrently)
npm run backend      # backend only (nodemon, port 5000)
npm run frontend     # frontend only (vite, port 5173–5176)
```

Backend standalone (from `CuidarMais/backend/`):
```bash
npm run dev    # nodemon server.js
npm start      # node server.js
```

There are no automated tests configured.

## Environment

Backend requires `CuidarMais/backend/.env` with:
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — secret for signing JWTs
- Email/Cloudinary vars (nodemailer, cloudinary integrations)

## Architecture

```
CuidarMais/          ← root workspace (concurrently orchestrator)
├── backend/         ← Node.js + Express (CommonJS)
│   └── src/
│       ├── server.js          ← entry: connects DB, calls createApp()
│       ├── app.js             ← exports async createApp() (required for Apollo Server 5)
│       ├── config/            ← db.js (mongoose), env.js
│       ├── models/            ← Mongoose schemas: User, Casa, Visita, Candidatura, Assistido, ConviteGestor, Avaliacao
│       ├── routes/            ← Express routers per resource
│       ├── controllers/       ← business logic
│       ├── middlewares/       ← auth.js (JWT verify), checkRole.js, validate.js (Zod)
│       ├── validators/        ← Zod schemas per resource
│       └── graphql/           ← typeDefs.js, resolvers.js
└── frontend/        ← React 19 + Vite + Tailwind (ESM)
    └── src/
        ├── main.jsx           ← ApolloProvider wraps App
        ├── App.jsx            ← routes: /, /login, /cadastro, /dashboard, /admin
        ├── contexts/          ← AuthContext (JWT + user in localStorage), ThemeContext
        ├── lib/apolloClient.js
        ├── graphql/queries.js
        ├── pages/             ← landing/, auth/, dashboard/
        └── components/        ← layout/ (Navbar, footer), ui/ (ModalAgendamento)
```

## Key Patterns

**Route protection (REST):** Middleware chain is `auth` → `checkRole(...roles)` → `validate(schema)` → controller. The `validate` middleware runs `schema.safeParse(req.body)` and replaces `req.body` with the parsed, clean data.

**app.js must be async:** Apollo Server 5 requires `await apolloServer.start()` before attaching middleware. `createApp()` is async and `server.js` calls it with `await`.

**GraphQL auth:** JWT is verified inside the Apollo `context` function in `app.js` (not via the REST `auth` middleware). Resolvers access `context.usuario`.

**User roles:** `familia` (default self-registered), `gestor` (invited by admin via `ConviteGestor` with 48h expiry code sent by email), `admin`.

**Frontend auth state:** Stored in `localStorage` (`token`, `usuario` JSON). `AuthContext` exposes `{ usuario, token, login, logout }`. `useAuth()` hook is the access point.

**CORS:** Backend allows `localhost:5174`, `5175`, `5176` (Vite's dev server port varies). If adding new origins, update `corsOptions` in `app.js`.

**Dashboard routing:** `/dashboard` renders `<Dashboard>` which conditionally renders `<DashboardFamilia>` or `<DashboardGestor>` based on `usuario.role`. `/admin` renders `<DashboardAdmin>`.
