# CuidarMais

Plataforma de gestão de casas de apoio social em Campina Grande - PB.

Conecta famílias a casas de acolhimento para idosos, pessoas em reabilitação e quem precisa de suporte social.

## Stack

- **Backend:** Node.js + Express + MongoDB Atlas + JWT
- **Frontend:** React 19 + Vite + Tailwind CSS
- **API:** REST + GraphQL (Apollo Server 5)

## Como rodar

### Pré-requisitos

- Node.js 18+
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Clone o repositório

```bash
git clone https://github.com/Gabrieldev707/CuidarMais.git
cd CuidarMais
```

### 2. Configure o backend

Crie o arquivo `backend/.env`:

```env
PORT=5000
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=90d
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

### 3. Instale as dependências

```bash
# Dependências da raiz (concurrently)
npm install

# Backend
npm install --prefix backend

# Frontend
npm install --prefix frontend
```

### 4. Rode o projeto

```bash
# Sobe backend (porta 5000) + frontend (porta 5173) juntos
npm run dev
```

Ou separadamente:

```bash
npm run backend    # só o backend
npm run frontend   # só o frontend
```

### URLs

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| GraphQL | http://localhost:5000/graphql |

## Roles de usuário

| Role | Como obter |
|---|---|
| `familia` | Cadastro direto na plataforma |
| `gestor` | Convite enviado pelo admin (código válido por 48h) |
| `admin` | Definido diretamente no banco de dados |
