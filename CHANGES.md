# CHANGES.md — O que foi adicionado ao projeto CuidarMais

Este arquivo documenta as mudanças feitas após o commit inicial, explicando cada decisão técnica.

---

## 1. Zod — Validação completa de todos os endpoints

### O que era antes
Zod já estava instalado (`zod ^4.3.6`) e havia validators apenas para autenticação (`src/validators/auth.validators.js`). Todas as outras rotas (casas, visitas, candidaturas, assistidos, admin) não tinham nenhuma validação de entrada.

### O que foi feito

**Novos arquivos de validators criados:**

| Arquivo | Cobre |
|---|---|
| `src/validators/casa.validators.js` | Criação, edição e atualização de vagas de casas |
| `src/validators/visita.validators.js` | Agendamento de visita e atualização de status |
| `src/validators/candidatura.validators.js` | Envio e resposta de candidaturas |
| `src/validators/assistido.validators.js` | Cadastro e edição de assistido |
| `src/validators/admin.validators.js` | Geração de convite e validação de código |

**Rotas atualizadas para usar `validate(schema)`:**

Todas as rotas de criação/mutação agora passam pelo middleware `validate()` antes de chegar ao controller:

```js
// Exemplo em casa.routes.js
router.post('/', auth, checkRole('gestor', 'admin'), validate(criarCasaSchema), casaController.criarCasa);
```

### Como o middleware `validate` funciona

O arquivo `src/middlewares/validate.js` recebe um schema Zod, chama `.safeParse(req.body)`, e:
- Se os dados forem **inválidos**: retorna `400` com lista de erros no formato `{ campo, mensagem }`
- Se forem **válidos**: substitui `req.body` pelos dados limpos e sanitizados pelo Zod, e chama `next()`

### Detalhes dos schemas

**Casa** — valida:
- `tipo`: deve ser um dos 4 valores (`idosos`, `dependentes_quimicos`, `saude_mental`, `vulnerabilidade_social`)
- `endereco.coords`: obriga `lat` e `lng` como números
- `servicos`: array com os valores permitidos (mesma lista do model Mongoose)
- `atualizarCasaSchema` é o `criarCasaSchema` com `.partial()` — todos os campos viram opcionais para PUT/PATCH

**Visita** — valida:
- `data`: string que parseie em `Date` válida
- `horario`: regex `HH:MM`
- `status`: enum `pendente | confirmada | cancelada | realizada`

**Candidatura** — valida:
- `status` na resposta do gestor: só aceita `aceita` ou `recusada`

**Assistido** — valida:
- `dataNascimento`: string que parseie em `Date` válida
- `perfil`: enum que espelha o model Mongoose
- `contatoEmergencia`: sub-objeto opcional com nome, telefone e parentesco

---

## 2. GraphQL — Apollo Server + Apollo Client

### Decisão de arquitetura
GraphQL foi adicionado **em paralelo** à API REST. Nenhuma rota REST foi removida ou modificada. As duas APIs convivem na mesma aplicação Express:
- REST: `http://localhost:5000/api/*`
- GraphQL: `http://localhost:5000/graphql`

### Por que Apollo Server 5?
É a versão instalada pelo `npm install @apollo/server`. No Apollo Server 5, a integração com Express foi movida para um pacote separado: `@as-integrations/express4`. Por isso, foram instalados dois pacotes:
```
@apollo/server
@as-integrations/express4
graphql-tag
```

### Backend — Arquivos criados

#### `src/graphql/typeDefs.js`
Define o **schema GraphQL** — os tipos de dados e as operações disponíveis.

**Tipos definidos:**
- `Casa` — com todos os campos do model, incluindo `gestor: Gestor` (resolve o `gestorId` populado)
- `Visita` — com `casa: Casa` resolvido via populate
- `Candidatura`
- `Gestor` (subconjunto de User: id, nome, email, telefone)
- `Endereco` e `Coords`

**Queries disponíveis:**
```graphql
casas(cidade, tipo, servico, apenasComVagas)  # pública
casa(id)                                       # pública
minhasVisitas                                  # requer JWT
minhasCandidaturas                             # requer JWT
```

**Mutations disponíveis:**
```graphql
agendarVisita(casaId, data, horario, observacoes)  # requer JWT
cancelarVisita(id)                                  # requer JWT
```

#### `src/graphql/resolvers.js`
Contém a lógica que executa cada query/mutation. **Reutiliza os models Mongoose diretamente** — sem duplicar lógica dos controllers REST.

**Autenticação nos resolvers:** cada resolver protegido verifica `context.usuario`. Se for null (sem token), lança `Error('Não autenticado')`, que o Apollo converte em erro GraphQL com código 401.

**Field resolvers:** necessários porque Mongoose usa `_id` mas GraphQL espera `id`:
```js
Casa: {
    id: (parent) => parent._id.toString(),
    gestor: (parent) => parent.gestorId,  // resolve o campo populado
}
```

#### Mudança em `src/app.js`
O arquivo `app.js` agora exporta uma **função assíncrona `createApp()`** em vez do objeto `app` diretamente. Isso é necessário porque o Apollo Server precisa ser inicializado com `await apolloServer.start()` antes de ser montado como middleware.

O token JWT é extraído do header `Authorization` no `context` do Apollo:
```js
context: async ({ req }) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);
        return { usuario };
    }
    return { usuario: null };
}
```

#### Mudança em `server.js`
Como `createApp()` agora é assíncrona, o `server.js` usa um padrão `async function start()` para aguardar tanto a conexão com o MongoDB quanto a inicialização do Apollo antes de subir o servidor HTTP.

### Frontend — Arquivos criados

#### `src/lib/apolloClient.js`
Cria a instância do `ApolloClient` com dois **links** encadeados:

1. **`authLink`**: intercepta cada requisição e injeta o token JWT do `localStorage` no header `Authorization`
2. **`httpLink`**: aponta para o endpoint GraphQL derivando a URL do `VITE_API_URL` (substitui `/api` por `/graphql`)

O cache usa `InMemoryCache` padrão do Apollo.

#### `src/graphql/queries.js`
Centraliza todas as queries e mutations como constantes `gql`. Ao invés de escrever a string GraphQL dentro dos componentes, importa-se daqui:
```js
import { GET_CASAS, AGENDAR_VISITA } from '../graphql/queries'
```

**Queries disponíveis:** `GET_CASAS`, `GET_CASA`, `GET_MINHAS_VISITAS`, `GET_MINHAS_CANDIDATURAS`
**Mutations disponíveis:** `AGENDAR_VISITA`, `CANCELAR_VISITA`

#### Mudança em `src/main.jsx`
O `ApolloProvider` foi adicionado como o provider mais externo, envolvendo toda a aplicação:
```jsx
<ApolloProvider client={apolloClient}>
  <App />   {/* ThemeProvider e AuthProvider ficam dentro do App */}
</ApolloProvider>
```

### Como usar o GraphQL nos componentes

```jsx
import { useQuery, useMutation } from '@apollo/client'
import { GET_CASAS, AGENDAR_VISITA } from '../graphql/queries'

// Query
const { data, loading, error } = useQuery(GET_CASAS, {
  variables: { apenasComVagas: true, tipo: 'idosos' }
})

// Mutation
const [agendarVisita, { loading }] = useMutation(AGENDAR_VISITA)
await agendarVisita({ variables: { casaId, data, horario } })
```

### Testando o GraphQL — Apollo Sandbox

Com o servidor rodando, acesse `http://localhost:5000/graphql` no browser. O Apollo abre um sandbox interativo onde você pode explorar o schema e testar queries.

Exemplo de query para testar sem autenticação:
```graphql
query {
  casas(apenasComVagas: true) {
    id
    nome
    tipo
    vagasDisponiveis
    endereco { cidade bairro }
    gestor { nome }
  }
}
```

Para queries que exigem JWT (minhasVisitas, etc.), clique em "Headers" no sandbox e adicione:
```json
{ "Authorization": "Bearer SEU_TOKEN_AQUI" }
```

---

## Como o GraphQL funciona na prática

### Fluxo de uma requisição

O GraphQL foi adicionado **em paralelo** ao REST — nenhuma rota existente foi removida. As duas APIs coexistem:
- REST: `http://localhost:5000/api/*`
- GraphQL: `http://localhost:5000/graphql`

Quando o frontend manda uma query:
```
Frontend → POST /graphql → Apollo Server → Resolver → Mongoose → MongoDB
```
O Apollo Server extrai o token JWT do header `Authorization`, coloca o usuário no `context`, e o resolver executa usando os mesmos models Mongoose do REST.

### Usando nos componentes React

Em vez de `axios`, usa-se os hooks do Apollo:

```jsx
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_CASAS, AGENDAR_VISITA } from '../graphql/queries'

// Buscar casas (substitui api.get('/casas'))
const { data, loading, error } = useQuery(GET_CASAS, {
  variables: { apenasComVagas: true }
})

// Agendar visita (substitui api.post('/visitas'))
const [agendarVisita] = useMutation(AGENDAR_VISITA)
await agendarVisita({ variables: { casaId, data, horario } })
```

### Diferença principal do REST

No REST o backend decide o que retornar. No GraphQL você pede só o que precisa:
```graphql
query {
  casas(apenasComVagas: true) {
    nome
    vagasDisponiveis
    endereco { cidade }
  }
}
```

### Rotas GraphQL disponíveis

| Operação | Tipo | Auth |
|---|---|---|
| `casas(cidade, tipo, servico, apenasComVagas)` | Query | Não |
| `casa(id)` | Query | Não |
| `minhasVisitas` | Query | Sim |
| `minhasCandidaturas` | Query | Não |
| `agendarVisita(casaId, data, horario, observacoes)` | Mutation | Sim |
| `cancelarVisita(id)` | Mutation | Sim |

Para explorar visualmente, acesse `http://localhost:5000/graphql` com o backend rodando — o Apollo abre um sandbox interativo com o schema completo.

---

## Resumo de todos os arquivos modificados/criados

### Backend
| Arquivo | Ação |
|---|---|
| `src/validators/casa.validators.js` | Criado |
| `src/validators/visita.validators.js` | Criado |
| `src/validators/candidatura.validators.js` | Criado |
| `src/validators/assistido.validators.js` | Criado |
| `src/validators/admin.validators.js` | Criado |
| `src/graphql/typeDefs.js` | Criado |
| `src/graphql/resolvers.js` | Criado |
| `src/routes/casa.routes.js` | Modificado (adicionado validate) |
| `src/routes/visita.routes.js` | Modificado (adicionado validate) |
| `src/routes/candidatura.routes.js` | Modificado (adicionado validate) |
| `src/routes/assistido.routes.js` | Modificado (adicionado validate) |
| `src/routes/admin.routes.js` | Modificado (adicionado validate) |
| `src/app.js` | Modificado (createApp async + Apollo middleware) |
| `server.js` | Modificado (async start para aguardar createApp) |

### Frontend
| Arquivo | Ação |
|---|---|
| `src/lib/apolloClient.js` | Criado |
| `src/graphql/queries.js` | Criado |
| `src/main.jsx` | Modificado (ApolloProvider) |

### Dependências instaladas
```
backend:  @apollo/server, @as-integrations/express4, graphql, graphql-tag
frontend: @apollo/client, graphql
```
