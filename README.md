# CuidarMais

<div align="center">

# 🏠 CuidarMais
### Plataforma de Conexão Social — Campina Grande, PB

**Conectando famílias a casas de apoio com tecnologia, cuidado e agilidade.**

![React](https://img.shields.io/badge/React-v19.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20.19%2B-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Express-v4.18.2-000000?style=for-the-badge&logo=express)
![Vite](https://img.shields.io/badge/Vite-v7.x-646CFF?style=for-the-badge&logo=vite)

[Aplicação](https://cuidarmais.vercel.app) · [API](https://cuidarmais-backend-production.up.railway.app) · [Funcionalidades](#-funcionalidades-principais) · [Como Rodar](#-como-rodar)

</div>

---

## 🌐 Ambiente Publicado

| Serviço | URL |
|---|---|
| Frontend | https://cuidarmais.vercel.app |
| API REST | https://cuidarmais-backend-production.up.railway.app/api |
| Healthcheck | https://cuidarmais-backend-production.up.railway.app/health |
| GraphQL | https://cuidarmais-backend-production.up.railway.app/graphql |

### Credenciais de teste público

Use estas contas na [tela de login](https://cuidarmais.vercel.app/login):

| Perfil | Email | Senha | Estado inicial |
|---|---|---|---|
| Família | `ana.santos@cuidarmais.com` | `CuidarMais@2026` | Responsável por Maria José Santos |
| Gestor | `roberto.almeida@cuidarmais.com` | `CuidarMais@2026` | Administra a Casa Esperança Campina Grande |
| Admin | `admin@cuidarmais.com` | `CuidarMais@2026` | Somente leitura |

A conta admin pública não pode gerar ou excluir convites. Códigos e emails de convites também são mascarados para evitar exposição de dados reais.

> Essas credenciais são exclusivas do ambiente de teste público. Os dados são realistas para validação acadêmica, mas não devem representar pessoas privadas reais.

---

## ✨ Funcionalidades Principais

### 👨‍👩‍👧 Dashboard Família
- Mapa interativo com casas de apoio geolocalizadas via **OpenStreetMap + Leaflet**
- Sistema de recomendação automático baseado no perfil do assistido
- Cadastro de assistido com perfil médico completo (dependência, condições, contato de emergência)
- Envio de candidaturas com mensagem personalizada para gestores
- Agendamento de visitas com seleção de data e turno (manhã/tarde)
- Histórico de candidaturas com status em tempo real
- Histórico de visitas com opção de avaliação por estrelas
- Estatísticas pessoais (visitas agendadas, realizadas, casas visitadas, candidaturas)

### 🏡 Dashboard Gestor
- Relacionamento 1:1: cada gestor administra no máximo uma casa
- Onboarding automático para gestores que ainda não cadastraram a casa
- Cadastro de casas com geocodificação automática via **Nominatim (OSM)**
- Preenchimento automático de endereço por CEP via **ViaCEP**
- Seleção de serviços oferecidos (18 categorias)
- Gerenciamento de visitas pendentes (confirmar / recusar)
- Histórico completo de visitas com status em tempo real
- Estatísticas da casa (pendentes, confirmadas, realizadas, total)

### 🛡️ Dashboard Admin
- Geração de convites com envio automático por **email (Nodemailer + Gmail)**
- Listagem de convites com status (Pendente / Usado / Expirado)
- Exclusão de convites
- Estatísticas globais do sistema (usuários, gestores, casas, visitas)

### 🔐 Autenticação
- Cadastro público para família e cadastro de gestor mediante convite
- Sistema de convite exclusivo para gestores (código de 8 caracteres, validade de 48h)
- Autenticação via **JWT** com expiração de 90 dias
- Proteção de rotas por role com middleware dedicado

---

## 🛠 Tecnologias

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| React | v19.x | Interface de usuário |
| Vite | v6.x | Bundler e servidor de desenvolvimento |
| React Router | v7.x | Roteamento SPA |
| Leaflet + React-Leaflet | v1.9.4 | Mapa interativo |
| Axios | latest | Requisições HTTP |
| Tailwind CSS | v3.x | Estilização utilitária |

### Backend
| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | v24.11.0 | Runtime |
| Express | v4.18.2 | Framework HTTP |
| MongoDB Atlas | v8.x | Banco de dados NoSQL |
| Mongoose | v8.x | ODM para MongoDB |
| JWT (jsonwebtoken) | latest | Autenticação |
| bcryptjs | latest | Hash de senhas |
| Nodemailer | latest | Envio de emails |
| Helmet | latest | Segurança HTTP |
| dotenv | latest | Variáveis de ambiente |
| Nodemon | latest | Hot reload em desenvolvimento |
| Zod | v4.x | Validação de dados nas rotas |
| Apollo Server | v5.x | Servidor GraphQL |
| graphql-tag | latest | Parser de queries GraphQL |

### Frontend
| Tecnologia | Versão | Uso |
|---|---|---|
| Apollo Client | v4.x | Queries e mutations GraphQL |

### Serviços Externos
| Serviço | Uso |
|---|---|
| MongoDB Atlas | Hospedagem do banco de dados na nuvem |
| Nominatim (OpenStreetMap) | Geocodificação de endereços |
| ViaCEP | Preenchimento automático de endereço por CEP |
| Gmail (SMTP) | Envio de emails de convite |

---

## 📁 Estrutura do Projeto

```
CuidarMais/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── casaController.js
│   │   │   ├── visitaController.js
│   │   │   ├── assistidoController.js
│   │   │   ├── candidaturaController.js
│   │   │   └── adminController.js
│   │   ├── middlewares/
│   │   │   ├── auth.js
│   │   │   └── checkRole.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Casa.js
│   │   │   ├── Assistido.js
│   │   │   ├── Visita.js
│   │   │   ├── Candidatura.js
│   │   │   └── ConviteGestor.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── casa.routes.js
│   │   │   ├── visita.routes.js
│   │   │   ├── assistido.routes.js
│   │   │   ├── candidatura.routes.js
│   │   │   └── admin.routes.js
│   │   ├── graphql/
│   │   │   ├── typeDefs.js
│   │   │   └── resolvers.js
│   │   ├── validators/
│   │   │   ├── auth.validators.js
│   │   │   ├── casa.validators.js
│   │   │   ├── visita.validators.js
│   │   │   ├── candidatura.validators.js
│   │   │   ├── assistido.validators.js
│   │   │   └── admin.validators.js
│   │   └── app.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── ui/
│   │   │       └── ModalAgendamento.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── landing/
│   │   │   │   └── LandingPage.jsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Cadastro.jsx
│   │   │   └── dashboard/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── DashboardFamilia.jsx
│   │   │       ├── DashboardGestor.jsx
│   │   │       └── DashboardAdmin.jsx
│   │   ├── graphql/
│   │   │   └── queries.js
│   │   ├── lib/
│   │   │   └── apolloClient.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .env
│   └── package.json
└── package.json
```

---

## 📡 Documentação da API

**Base URL:** `http://localhost:5000/api`

### 🔐 Auth — `/api/auth`
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/register` | Público | Cadastro de usuário |
| POST | `/login` | Público | Login e geração de token JWT |
| GET | `/perfil` | Autenticado | Dados do usuário logado |

### 🏠 Casas — `/api/casas`
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/` | Público | Listar casas (com filtros) |
| POST | `/` | Gestor | Cadastrar nova casa |
| GET | `/:id` | Público | Detalhes de uma casa |
| PUT | `/:id` | Gestor | Atualizar casa |

### 👤 Assistidos — `/api/assistidos`
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/` | Família | Cadastrar assistido |
| GET | `/meu` | Família | Buscar assistido da família |
| PUT | `/meu` | Família | Atualizar assistido |

### 📋 Candidaturas — `/api/candidaturas`
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/` | Família | Enviar candidatura |
| GET | `/minhas` | Família | Listar candidaturas da família |
| PATCH | `/:id/responder` | Gestor | Aceitar ou recusar candidatura |
| GET | `/casa/:casaId` | Gestor | Listar candidaturas da casa |

### 📅 Visitas — `/api/visitas`
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/` | Família | Agendar visita |
| GET | `/minhas` | Família/Gestor | Listar visitas |
| PATCH | `/:id/status` | Gestor | Atualizar status da visita |

### 🛡️ Admin — `/api/admin`
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/convite` | Admin | Gerar e enviar convite por email |
| GET | `/convites` | Admin | Listar todos os convites |
| DELETE | `/convite/:id` | Admin | Remover convite |
| POST | `/validar-codigo` | Público | Validar código de convite |
| GET | `/stats` | Admin | Estatísticas gerais do sistema |

---

## 🔍 Validação de Dados (Zod)

Todas as rotas que recebem body são validadas com **Zod v4** antes de chegar ao controller. Se os dados forem inválidos, a resposta é sempre:

```json
{
  "erro": "Dados inválidos",
  "detalhes": [
    { "campo": "horario", "mensagem": "Horário deve estar no formato HH:MM" }
  ]
}
```

Os schemas ficam em `backend/src/validators/` — um arquivo por domínio.

> ⚠️ Ao testar pelo Thunder Client / Postman, sempre envie o header `Content-Type: application/json`, caso contrário o body chega vazio e o login retorna "Email ou senha incorretos".

---

## 🔷 API GraphQL

Além da REST, o projeto expõe uma API GraphQL em paralelo.

**URL:** `http://localhost:5000/graphql`

Acesse essa URL no browser com o backend rodando para abrir o **Apollo Sandbox** — interface interativa com o schema completo.

Para rotas autenticadas, envie o header `Authorization: Bearer <token>`.

### Queries disponíveis

| Query | Auth | Descrição |
|---|---|---|
| `casas(cidade, tipo, servico, apenasComVagas)` | Não | Listar casas com filtros |
| `casa(id)` | Não | Detalhes de uma casa |
| `minhasVisitas` | Sim | Visitas do usuário logado |
| `minhasCandidaturas` | Sim | Candidaturas do usuário logado |

### Mutations disponíveis

| Mutation | Auth | Descrição |
|---|---|---|
| `agendarVisita(casaId, data, horario, observacoes)` | Sim | Agendar visita |
| `cancelarVisita(id)` | Sim | Cancelar uma visita |

### Exemplo de query

```graphql
query {
  casas(apenasComVagas: true) {
    id
    nome
    vagasDisponiveis
    endereco { cidade bairro }
    gestor { nome email }
  }
}
```

### Usando nos componentes React

```jsx
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_CASAS, AGENDAR_VISITA } from '../graphql/queries'

const { data, loading } = useQuery(GET_CASAS, {
  variables: { apenasComVagas: true }
})

const [agendarVisita] = useMutation(AGENDAR_VISITA)
await agendarVisita({ variables: { casaId, data, horario } })
```

Todas as queries e mutations já estão definidas em `frontend/src/graphql/queries.js`.

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 20.19 até 24.x
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
- Conta Gmail com [senha de app](https://support.google.com/accounts/answer/185833) habilitada

### 1. Clone o repositório
```bash
git clone https://github.com/Gabrieldev707/CuidarMais.git
cd CuidarMais
```

### 2. Instale as dependências
```bash
# Na raiz (instala o concurrently)
npm install

# Backend
npm install --prefix backend

# Frontend
npm install --prefix frontend
```

### 3. Configure as variáveis de ambiente

Crie `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=sua_connection_string_mongodb_atlas
JWT_SECRET=use_um_segredo_com_no_minimo_32_caracteres
JWT_EXPIRES_IN=90d
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail
EMAIL_FROM="CuidarMais <seuemail@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REJECT_UNAUTHORIZED=true
FRONTEND_URL=http://localhost:5174
```

Crie `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Rode o projeto
```bash
# Na raiz — sobe backend (porta 5000) e frontend (porta 5174) juntos
npm run dev

# Ou separadamente:
npm run backend    # só o backend
npm run frontend   # só o frontend
```

### URLs

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5174 |
| Backend API | http://localhost:5000/api |
| GraphQL Sandbox | http://localhost:5000/graphql |

### Contas demo no banco local

```bash
npm run seed:demo
```

O comando é idempotente: cria ou atualiza as três contas documentadas acima, além do assistido e da casa de apoio usados nos testes.

### Verificação antes do deploy

```bash
npm run check
```

Esse comando valida a sintaxe do backend, executa o ESLint e gera o build de produção do frontend.

---

## 🚢 Deploy

### Railway

Opção recomendada: configure o diretório raiz do serviço como `backend`.
Nesse caso, deixe o arquivo de configuração como `railway.json` dentro desse diretório, ou use a configuração padrão do Railway.

Se o serviço estiver conectado pela raiz do repositório, o arquivo `railway.json` da raiz instala e inicia o backend automaticamente.

Cadastre as variáveis:

```env
NODE_ENV=production
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=90d
FRONTEND_URL=https://cuidarmais.vercel.app,https://frontend-one-orcin-79.vercel.app
# Opcional para previews adicionais da Vercel:
# CORS_ALLOWED_PATTERNS=^https://frontend-[a-z0-9-]+\\.vercel\\.app$
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM="CuidarMais <email-configurado@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REJECT_UNAUTHORIZED=true
```

O Railway executa `npm start` e verifica `/health`. Para recriar os dados de teste, execute `npm run seed:demo` no serviço.

Em produção, os índices não são alterados automaticamente durante o boot. Depois de revisar possíveis dados legados duplicados, aplique os índices declarados pelos models com:

```bash
npm run sync:indexes
```

O comando interrompe a operação e lista as casas envolvidas caso encontre mais de uma casa para o mesmo gestor.

### Vercel

Configure o diretório raiz como `frontend`. A variável utilizada no build é:

```env
VITE_API_URL=https://cuidarmais-backend-production.up.railway.app/api
```

O arquivo `vercel.json` contém o rewrite da SPA e headers básicos de segurança.

---

## 🗂️ Roles do Sistema

| Role | Acesso |
|---|---|
| `familia` | Dashboard família, candidaturas, visitas, assistido |
| `gestor` | Dashboard gestor, cadastro de casas, gerenciamento de visitas |
| `admin` | Painel admin, geração de convites, estatísticas globais |

---

## 👥 Autores

<table>
  <tr>
    <td align="center">
      <b>Gabriel Azevedo</b><br/>
      <b>Carlos Adrians</b><br/>
      <b>Mateus Régis</b><br/>
      <b>Miguel Oliveira</b><br/>
      <sub>Fullstack Developer</sub><br/>
      <a href="https://github.com/Gabrieldev707">@Gabrieldev707</a>
    </td>
  </tr>
</table>

---

<div align="center">
  <sub>Desenvolvido com 💙 para a disciplina de Sistemas Da Informação — Unifacisa · Campina Grande, PB</sub>
</div>
