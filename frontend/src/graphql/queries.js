import { gql } from '@apollo/client';

export const GET_CASAS = gql`
  query GetCasas($cidade: String, $tipo: String, $servico: String, $apenasComVagas: Boolean) {
    casas(cidade: $cidade, tipo: $tipo, servico: $servico, apenasComVagas: $apenasComVagas) {
      id
      nome
      descricao
      tipo
      capacidade
      vagasDisponiveis
      servicos
      telefone
      avaliacaoMedia
      endereco {
        rua
        numero
        bairro
        cidade
        estado
        coords {
          lat
          lng
        }
      }
      gestor {
        nome
        email
      }
    }
  }
`;

export const GET_CASA = gql`
  query GetCasa($id: ID!) {
    casa(id: $id) {
      id
      nome
      descricao
      tipo
      capacidade
      vagasDisponiveis
      servicos
      telefone
      email
      avaliacaoMedia
      totalAvaliacoes
      endereco {
        rua
        numero
        bairro
        cidade
        estado
        cep
        coords { lat lng }
      }
      gestor {
        nome
        email
        telefone
      }
    }
  }
`;

export const GET_MINHAS_VISITAS = gql`
  query GetMinhasVisitas {
    minhasVisitas {
      id
      data
      horario
      status
      observacoes
      casa {
        id
        nome
        endereco { cidade bairro }
      }
    }
  }
`;

export const GET_MINHAS_CANDIDATURAS = gql`
  query GetMinhasCandidaturas {
    minhasCandidaturas {
      id
      casaId
      status
      mensagem
      respostaGestor
      createdAt
    }
  }
`;

export const AGENDAR_VISITA = gql`
  mutation AgendarVisita($casaId: ID!, $data: String!, $horario: String!, $observacoes: String) {
    agendarVisita(casaId: $casaId, data: $data, horario: $horario, observacoes: $observacoes) {
      id
      data
      horario
      status
      casa { id nome }
    }
  }
`;

export const CANCELAR_VISITA = gql`
  mutation CancelarVisita($id: ID!) {
    cancelarVisita(id: $id) {
      id
      status
    }
  }
`;
