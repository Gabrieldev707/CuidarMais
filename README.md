# CuidarMais

<div align="center">

# 🏠 CuidarMais
### Plataforma de Conexão Social — Campina Grande, PB

**Conectando famílias a casas de apoio com tecnologia, cuidado e agilidade.**

![React](https://img.shields.io/badge/React-v19.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-v24.11.0-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![Express](https://img.shields.io/badge/Express-v4.18.2-000000?style=for-the-badge&logo=express)
![Vite](https://img.shields.io/badge/Vite-v6.x-646CFF?style=for-the-badge&logo=vite)

[Funcionalidades](#-funcionalidades) · [Tecnologias](#-tecnologias) · [Documentação API](#-documentação-da-api) · [Como Rodar](#-como-rodar) · [Autores](#-autores)

</div>

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
- Registro com validação por papel (família, gestor, admin)
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

## 🚀 Como Rodar

### Pré-requisitos
- Node.js v18+
- Conta no MongoDB Atlas
- Conta Gmail com senha de app habilitada

### 1. Clone o repositório
```bash
git clone https://github.com/Gabrieldev707/CuidarMais
cd CuidarMais
```

### 2. Instale as dependências
```bash
# Na raiz (instala concurrently)
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure o ambiente

Crie o arquivo `backend/.env`:
```env
PORT=5000
MONGO_URI=sua_connection_string_mongodb_atlas
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=90d
EMAIL_USER=seuemail@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail
```

Crie o arquivo `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Rode o projeto
```bash
# Na raiz — sobe backend (porta 5000) e frontend (porta 5173) juntos
npm run dev

# Ou separado:
npm run backend
npm run frontend
```

### 5. Crie o usuário admin
Use Thunder Client, Insomnia ou Postman:
```http
POST http://localhost:5000/api/auth/register-dev
Content-Type: application/json

{
  "nome": "Admin",
  "email": "admin@cuidarmais.com",
  "senha": "sua_senha",
  "telefone": "(83) 99999-0000",
  "role": "admin"
}
```
> ⚠️ Remova a rota `/register-dev` antes de subir para produção!

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