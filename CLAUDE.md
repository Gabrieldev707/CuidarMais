# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CuidarMais is a social support house management platform for Campina Grande - PB, Brazil. It connects families seeking care homes (`casas de apoio`) with managers who run them, under admin supervision.

## Repository Structure

The repo has a monorepo layout with a shared root `package.json`:

```
CuidarMais/
  backend/    # Express + MongoDB API (CommonJS)
  frontend/   # React + Vite SPA (ESM)
```

## Commands

### Run both simultaneously (from `CuidarMais/` directory)
```bash
npm run dev
```

### Backend only (from `CuidarMais/backend/`)
```bash
npm run dev       # nodemon server.js (hot reload)
npm start         # node server.js
```

### Frontend only (from `CuidarMais/frontend/`)
```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Environment Variables

**Backend** (`CuidarMais/backend/.env`):
- `PORT` — defaults to 5000
- `MONGO_URI` — MongoDB Atlas connection string
- `JWT_SECRET` — secret for signing JWTs
- `JWT_EXPIRES_IN` — JWT expiration (e.g. `90d`)
- `EMAIL_USER` / `EMAIL_PASS` — Nodemailer credentials for sending invite emails

**Frontend** (`CuidarMais/frontend/.env`):
- `VITE_API_URL` — backend base URL (default: `http://localhost:5000/api`)
- `VITE_GOOGLE_MAPS_KEY` — Google Maps API key (optional; Leaflet is also available)

## Architecture

### Backend (Express/Node.js + Mongoose)

Entry point: `server.js` → `src/app.js`

**Route → Controller pattern**, with JWT middleware:

| Route prefix       | Controller              |
|--------------------|-------------------------|
| `/api/auth`        | `authController`        |
| `/api/casas`       | `casaController`        |
| `/api/visitas`     | `visitaController`      |
| `/api/assistidos`  | `assistidoController`   |
| `/api/candidaturas`| `candidaturaController` |
| `/api/admin`       | `adminController`       |

**Middlewares** (`src/middlewares/`):
- `auth.js` — verifies JWT, attaches `req.usuario`
- `checkRole.js` — role-based access: `checkRole('admin')`, `checkRole('gestor', 'admin')`, etc.
- `validate.js` — Zod schema validation wrapper

**User roles**: `familia` (default), `gestor`, `admin`

Gestores are invited by admins via `ConviteGestor` (48h expiry code sent by email). The `POST /api/auth/register-dev` route is a **dev-only** bypass — remove before production.

### Frontend (React + Vite + Tailwind CSS)

Entry: `src/main.jsx` → `src/App.jsx`

**Context providers** wrap the app:
- `ThemeContext` — light/dark theme
- `AuthContext` — stores `usuario` + `token` in `localStorage`, exposes `login()` / `logout()`

**API calls** go through `src/services/api.js` (Axios instance), which auto-attaches the JWT `Authorization: Bearer` header from `localStorage`.

**Dashboard routing**: `/dashboard` renders `Dashboard.jsx`, which renders one of three role-specific dashboards based on `usuario.role`:
- `DashboardFamilia` — for `familia` role
- `DashboardGestor` — for `gestor` role
- `DashboardAdmin` — for `admin` role (also accessible directly at `/admin`)

### Data Models

- **User** — `nome`, `email`, `senha` (bcrypt), `role`, `telefone`, `avatar`, `ativo`
- **Casa** — support house with `tipo` (idosos/dependentes_quimicos/saude_mental/vulnerabilidade_social), `endereco` with lat/lng coords, `servicos` enum list, linked `gestorId`
- **Assistido** — person seeking care, linked to a responsible user
- **Candidatura** — application of an `Assistido` to a `Casa`, with status flow: `pendente → em_analise → aceita/recusada`
- **Visita** — scheduled visit to a `Casa`, status: `pendente → confirmada → realizada/cancelada`
- **ConviteGestor** — invite code (48h TTL) for gestor onboarding

### Maps

The frontend uses both **Leaflet** (`react-leaflet`) and **@react-google-maps/api**. `VITE_GOOGLE_MAPS_KEY` must be set for Google Maps; Leaflet works without a key.
