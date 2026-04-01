const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Coords {
    lat: Float
    lng: Float
  }

  type Endereco {
    rua: String
    numero: String
    bairro: String
    cidade: String
    estado: String
    cep: String
    coords: Coords
  }

  type Gestor {
    id: ID!
    nome: String
    email: String
    telefone: String
  }

  type Casa {
    id: ID!
    nome: String!
    descricao: String
    tipo: String
    endereco: Endereco
    capacidade: Int
    vagasDisponiveis: Int
    servicos: [String]
    telefone: String
    email: String
    avaliacaoMedia: Float
    totalAvaliacoes: Int
    gestor: Gestor
    ativo: Boolean
    createdAt: String
  }

  type Visita {
    id: ID!
    casa: Casa
    data: String
    horario: String
    status: String
    observacoes: String
    createdAt: String
  }

  type Candidatura {
    id: ID!
    casaId: ID
    status: String
    mensagem: String
    respostaGestor: String
    dataResposta: String
    createdAt: String
  }

  type Query {
    # Casas públicas (não requer autenticação)
    casas(cidade: String, tipo: String, servico: String, apenasComVagas: Boolean): [Casa!]!
    casa(id: ID!): Casa

    # Requer autenticação
    minhasVisitas: [Visita!]!
    minhasCandidaturas: [Candidatura!]!
  }

  type Mutation {
    agendarVisita(casaId: ID!, data: String!, horario: String!, observacoes: String): Visita!
    cancelarVisita(id: ID!): Visita!
  }
`;

module.exports = typeDefs;
