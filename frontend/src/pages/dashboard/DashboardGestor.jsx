import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import { getApiError } from '../../services/errors'

const statusVisita = {
  pendente: { label: 'Pendente', cor: '#e8a87c' },
  confirmada: { label: 'Confirmada', cor: '#7ab894' },
  cancelada: { label: 'Cancelada', cor: '#e87c7c' },
  realizada: { label: 'Realizada', cor: '#80a6c6' }
}

const statusCandidatura = {
  pendente: { label: 'Pendente', cor: '#e8a87c' },
  em_analise: { label: 'Em análise', cor: '#80a6c6' },
  aceita: { label: 'Aceita', cor: '#7ab894' },
  recusada: { label: 'Recusada', cor: '#e87c7c' }
}

const tiposOpcoes = [
  { value: 'idosos', label: 'Idosos' },
  { value: 'dependentes_quimicos', label: 'Dependência química' },
  { value: 'saude_mental', label: 'Saúde mental' },
  { value: 'vulnerabilidade_social', label: 'Vulnerabilidade social' }
]

const servicosOpcoes = [
  { label: 'Enfermagem', value: 'enfermagem' },
  { label: 'Fisioterapia', value: 'fisioterapia' },
  { label: 'Alimentação', value: 'alimentacao' },
  { label: 'Transporte', value: 'transporte' },
  { label: 'Psicologia', value: 'psicologia' },
  { label: 'Psiquiatria', value: 'psiquiatria' },
  { label: 'Grupo de Apoio', value: 'grupo_de_apoio' },
  { label: 'Desintoxicação', value: 'desintoxicacao' },
  { label: 'Terapia Ocupacional', value: 'terapia_ocupacional' },
  { label: 'Oficinas Terapêuticas', value: 'oficinas_terapeuticas' },
  { label: 'Assistência Social', value: 'assistencia_social' },
  { label: 'Documentação', value: 'documentacao' },
  { label: 'Capacitação Profissional', value: 'capacitacao_profissional' },
  { label: 'Recreação', value: 'atividades_recreativas' },
  { label: 'Acomp. Médico', value: 'acompanhamento_medico' },
  { label: 'Reintegração Social', value: 'reintegracao_social' },
  { label: 'Apoio Jurídico', value: 'apoio_juridico' },
  { label: 'Medicamentos', value: 'medicamentos' }
]

const criarFormInicial = () => ({
  nome: '',
  descricao: '',
  tipo: '',
  telefone: '',
  email: '',
  capacidade: '',
  vagasDisponiveis: '',
  servicos: [],
  endereco: {
    rua: '',
    numero: '',
    bairro: '',
    cidade: 'Campina Grande',
    estado: 'PB',
    cep: ''
  }
})

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  border: '2px solid transparent',
  backgroundColor: 'var(--background)',
  color: 'var(--text)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
}

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '600',
  color: 'var(--text)',
  opacity: 0.7,
  marginBottom: '0.35rem'
}

const cardStyle = {
  backgroundColor: 'var(--secondary)',
  borderRadius: '20px',
  padding: '1.5rem'
}

const actionButton = (cor) => ({
  backgroundColor: `${cor}25`,
  color: cor,
  border: 'none',
  padding: '0.55rem 1rem',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '700',
  cursor: 'pointer'
})

const formatarData = (data) => (
  data ? new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Data não definida'
)

function EstadoVazio({ texto }) {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text)', opacity: 0.55 }}>
      {texto}
    </div>
  )
}

function Alerta({ tipo = 'erro', children }) {
  const sucesso = tipo === 'sucesso'
  return (
    <div style={{
      backgroundColor: sucesso ? '#7ab89420' : '#fee2e2',
      color: sucesso ? '#56886b' : '#dc2626',
      border: `1px solid ${sucesso ? '#7ab894' : '#fecaca'}`,
      borderRadius: '12px',
      padding: '0.9rem 1.1rem',
      marginBottom: '1.25rem',
      fontSize: '0.9rem',
      whiteSpace: 'pre-line'
    }}>
      {children}
    </div>
  )
}

export default function DashboardGestor() {
  const { usuario } = useAuth()
  const location = useLocation()
  const [aba, setAba] = useState(
    location.state?.onboardingGestor || location.state?.verificarCasaGestor ? 'inicio' : 'visitas'
  )
  const [visitas, setVisitas] = useState([])
  const [candidaturas, setCandidaturas] = useState([])
  const [casa, setCasa] = useState(null)
  const [vagasEdicao, setVagasEdicao] = useState('')
  const [loading, setLoading] = useState(true)
  const [erroDados, setErroDados] = useState('')
  const [erroAcao, setErroAcao] = useState('')
  const [processandoId, setProcessandoId] = useState('')
  const [form, setForm] = useState(criarFormInicial)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)

  const carregarDados = useCallback(async () => {
    setLoading(true)
    setErroDados('')

    const resultados = await Promise.allSettled([
      api.get('/casas/minhas'),
      api.get('/visitas/minhas'),
      api.get('/candidaturas/gestor')
    ])

    const mensagens = []
    const [resCasas, resVisitas, resCandidaturas] = resultados

    if (resCasas.status === 'fulfilled') {
      const casaRecebida = resCasas.value.data.casa || resCasas.value.data.casas?.[0] || null
      setCasa(casaRecebida)
      setVagasEdicao(casaRecebida ? String(casaRecebida.vagasDisponiveis) : '')
      if (casaRecebida) {
        setAba(abaAtual => ['inicio', 'cadastrar'].includes(abaAtual) ? 'casa' : abaAtual)
      } else {
        setAba(abaAtual => abaAtual === 'cadastrar' ? 'cadastrar' : 'inicio')
      }
    } else {
      mensagens.push(getApiError(resCasas.reason, 'Não foi possível carregar sua casa'))
    }

    if (resVisitas.status === 'fulfilled') {
      setVisitas(resVisitas.value.data.visitas || [])
    } else {
      mensagens.push(getApiError(resVisitas.reason, 'Não foi possível carregar as visitas'))
    }

    if (resCandidaturas.status === 'fulfilled') {
      setCandidaturas(resCandidaturas.value.data.candidaturas || [])
    } else {
      mensagens.push(getApiError(resCandidaturas.reason, 'Não foi possível carregar as candidaturas'))
    }

    if (mensagens.length) {
      setErroDados([...new Set(mensagens)].join('\n'))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  const executarAcao = async (id, acao) => {
    setErroAcao('')
    setSucesso('')
    setProcessandoId(id)
    try {
      await acao()
    } catch (err) {
      setErroAcao(getApiError(err, 'Não foi possível concluir a operação'))
    } finally {
      setProcessandoId('')
    }
  }

  const atualizarStatusVisita = (id, status) => executarAcao(id, async () => {
    await api.patch(`/visitas/${id}/status`, { status })
    setVisitas(prev => prev.map(visita => (
      visita._id === id ? { ...visita, status } : visita
    )))
    setSucesso('Status da visita atualizado.')
  })

  const responderCandidatura = (id, status) => executarAcao(id, async () => {
    await api.patch(`/candidaturas/${id}/responder`, { status })
    setCandidaturas(prev => prev.map(candidatura => (
      candidatura._id === id ? { ...candidatura, status } : candidatura
    )))
    setSucesso(status === 'aceita' ? 'Candidatura aceita.' : 'Candidatura recusada.')
  })

  const atualizarVagas = () => executarAcao(casa._id, async () => {
    const vagasDisponiveis = Number(vagasEdicao)
    if (!Number.isInteger(vagasDisponiveis) || vagasDisponiveis < 0 || vagasDisponiveis > casa.capacidade) {
      throw new Error(`Informe um valor entre 0 e ${casa.capacidade}`)
    }

    await api.patch(`/casas/${casa._id}/vagas`, { vagasDisponiveis })
    setCasa(prev => ({ ...prev, vagasDisponiveis }))
    setSucesso(`Vagas de ${casa.nome} atualizadas.`)
  })

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return
    setBuscandoCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()
      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            rua: data.logradouro || prev.endereco.rua,
            bairro: data.bairro || prev.endereco.bairro,
            cidade: data.localidade || prev.endereco.cidade,
            estado: data.uf || prev.endereco.estado,
            cep: cepLimpo
          }
        }))
      }
    } catch {
      setErroAcao('Não foi possível consultar o CEP. Preencha o endereço manualmente.')
    } finally {
      setBuscandoCep(false)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name.startsWith('endereco.')) {
      const campo = name.split('.')[1]
      setForm(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [campo]: value }
      }))
      if (campo === 'cep') buscarCep(value)
      return
    }
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const toggleServico = (value) => {
    setForm(prev => ({
      ...prev,
      servicos: prev.servicos.includes(value)
        ? prev.servicos.filter(item => item !== value)
        : [...prev.servicos, value]
    }))
  }

  const cadastrarCasa = async (event) => {
    event.preventDefault()
    setErroAcao('')
    setSucesso('')

    if (casa) {
      setErroAcao('Este gestor já possui uma casa cadastrada.')
      setAba('casa')
      return
    }

    if (!form.nome || !form.tipo || !form.capacidade || !form.descricao ||
        !form.endereco.cep || !form.endereco.rua || !form.endereco.numero || !form.endereco.bairro) {
      setErroAcao('Preencha os campos obrigatórios: nome, tipo, descrição, capacidade e endereço.')
      return
    }

    setSalvando(true)
    try {
      const payload = {
        ...form,
        capacidade: Number(form.capacidade),
        vagasDisponiveis: Number(form.vagasDisponiveis || form.capacidade)
      }
      if (!payload.telefone.trim()) delete payload.telefone
      if (!payload.email.trim()) delete payload.email

      const { data } = await api.post('/casas', payload)
      setCasa(data.casa)
      setVagasEdicao(String(data.casa.vagasDisponiveis))
      setForm(criarFormInicial())
      setSucesso('Casa cadastrada com sucesso e salva no banco.')
      setAba('casa')
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch (err) {
      setErroAcao(getApiError(err, 'Erro ao cadastrar casa'))
    } finally {
      setSalvando(false)
    }
  }

  const pendentes = visitas.filter(visita => visita.status === 'pendente')
  const candidaturasPendentes = candidaturas.filter(item => (
    item.status === 'pendente' || item.status === 'em_analise'
  ))

  const abas = casa
    ? [
        { key: 'visitas', label: `Visitas (${visitas.length})` },
        { key: 'candidaturas', label: `Candidaturas (${candidaturasPendentes.length})` },
        { key: 'casa', label: 'Minha casa' }
      ]
    : [
        { key: 'inicio', label: 'Boas-vindas' },
        { key: 'cadastrar', label: 'Cadastrar minha casa' }
      ]

  return (
    <main className="gestor-page" style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header className="gestor-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.2rem' }}>
              Painel do Gestor
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.6, fontSize: '0.95rem' }}>
              {casa
                ? `Olá, ${usuario?.nome?.split(' ')[0] || 'gestor'} — gerencie sua casa, candidaturas e visitas`
                : `Olá, ${usuario?.nome?.split(' ')[0] || 'gestor'} — vamos preparar seu espaço no CuidarMais`}
            </p>
          </div>
          <button type="button" onClick={carregarDados} disabled={loading} style={actionButton('#395f7f')}>
            {loading ? 'Atualizando...' : 'Atualizar dados'}
          </button>
        </header>

        <nav className="gestor-tabs" aria-label="Seções do painel" style={{
          display: 'flex',
          backgroundColor: 'var(--secondary)',
          borderRadius: '14px',
          padding: '0.35rem',
          gap: '0.3rem',
          marginBottom: '1.5rem'
        }}>
          {abas.map(item => (
            <button
              type="button"
              key={item.key}
              onClick={() => {
                setAba(item.key)
                setErroAcao('')
                setSucesso('')
              }}
              style={{
                flex: 1,
                padding: '0.7rem 0.85rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: '700',
                backgroundColor: aba === item.key ? 'var(--background)' : 'transparent',
                color: aba === item.key ? 'var(--primary)' : 'var(--text)'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {erroDados && (
          <Alerta>
            {erroDados}
            {'\n'}Verifique se o backend está rodando e se o IP foi liberado no MongoDB Atlas.
          </Alerta>
        )}
        {erroAcao && <Alerta>{erroAcao}</Alerta>}
        {sucesso && <Alerta tipo="sucesso">{sucesso}</Alerta>}

        {casa && (
          <section className="gestor-stats" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {[
              { label: 'Casa cadastrada', valor: 1, cor: '#9b8fc4' },
              { label: 'Candidaturas pendentes', valor: candidaturasPendentes.length, cor: '#e8a87c' },
              { label: 'Visitas pendentes', valor: pendentes.length, cor: '#e8a87c' },
              { label: 'Visitas confirmadas', valor: visitas.filter(item => item.status === 'confirmada').length, cor: '#7ab894' }
            ].map(item => (
              <div key={item.label} style={{
                backgroundColor: 'var(--secondary)',
                borderRadius: '16px',
                padding: '1.2rem',
                borderLeft: `4px solid ${item.cor}`
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: item.cor }}>{item.valor}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.65 }}>{item.label}</div>
              </div>
            ))}
          </section>
        )}

        {aba === 'inicio' && !casa && (
          <section style={{
            ...cardStyle,
            background: 'linear-gradient(135deg, var(--secondary), var(--background))',
            border: '1px solid rgba(128, 166, 198, 0.25)'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              display: 'grid',
              placeItems: 'center',
              backgroundColor: '#7ab89425',
              color: '#56886b',
              marginBottom: '1rem'
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h2 style={{ color: 'var(--text)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
              Sua conta de gestor está pronta
            </h2>
            <p style={{
              color: 'var(--text)',
              opacity: 0.68,
              lineHeight: 1.6,
              maxWidth: '650px',
              marginBottom: '1.5rem'
            }}>
              Agora cadastre a casa que você administra. Depois disso, o painel será liberado para receber candidaturas,
              organizar visitas e atualizar as vagas disponíveis.
            </p>

            <div className="gestor-onboarding-steps" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              {[
                { numero: '1', titulo: 'Conta criada', texto: 'Convite validado e acesso liberado.', concluido: true },
                { numero: '2', titulo: 'Cadastrar casa', texto: 'Informe endereço, capacidade e serviços.' },
                { numero: '3', titulo: 'Começar a gerenciar', texto: 'Receba candidaturas e visitas.' }
              ].map(etapa => (
                <div key={etapa.numero} style={{
                  backgroundColor: 'var(--secondary)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: `1px solid ${etapa.concluido ? '#7ab89470' : 'transparent'}`
                }}>
                  <div style={{
                    color: etapa.concluido ? '#56886b' : 'var(--primary)',
                    fontWeight: '800',
                    fontSize: '0.8rem',
                    marginBottom: '0.4rem'
                  }}>
                    ETAPA {etapa.numero}{etapa.concluido ? ' · CONCLUÍDA' : ''}
                  </div>
                  <div style={{ color: 'var(--text)', fontWeight: '700', marginBottom: '0.25rem' }}>
                    {etapa.titulo}
                  </div>
                  <div style={{ color: 'var(--text)', opacity: 0.58, fontSize: '0.8rem', lineHeight: 1.45 }}>
                    {etapa.texto}
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => setAba('cadastrar')} style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '0.95rem'
            }}>
              Cadastrar minha casa
            </button>
          </section>
        )}

        {casa && aba === 'visitas' && (
          <section style={cardStyle}>
            <h2 style={{ fontSize: '1.05rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
              Visitas da sua casa
            </h2>
            {loading ? (
              <EstadoVazio texto="Carregando visitas..." />
            ) : visitas.length === 0 ? (
              <EstadoVazio texto="Nenhuma visita encontrada para sua casa." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {visitas.map(visita => {
                  const status = statusVisita[visita.status] || statusVisita.pendente
                  return (
                    <article key={visita._id} className="gestor-row" style={{
                      backgroundColor: 'var(--background)',
                      borderRadius: '13px',
                      padding: '1.1rem 1.2rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div>
                        <strong style={{ color: 'var(--text)' }}>
                          {visita.responsavelId?.nome || 'Responsável'}
                        </strong>
                        <div style={{ color: 'var(--text)', opacity: 0.62, fontSize: '0.82rem', marginTop: '0.25rem' }}>
                          {visita.casaId?.nome || 'Casa'} · {formatarData(visita.data)} · {visita.horario === 'manha' ? 'Manhã' : 'Tarde'}
                        </div>
                        {visita.observacoes && (
                          <div style={{ color: 'var(--text)', opacity: 0.55, fontSize: '0.8rem', marginTop: '0.35rem' }}>
                            {visita.observacoes}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
                        <span style={{
                          backgroundColor: `${status.cor}25`,
                          color: status.cor,
                          padding: '0.35rem 0.8rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: '700'
                        }}>
                          {status.label}
                        </span>
                        {visita.status === 'pendente' && (
                          <>
                            <button
                              type="button"
                              disabled={processandoId === visita._id}
                              onClick={() => atualizarStatusVisita(visita._id, 'cancelada')}
                              style={actionButton('#e87c7c')}
                            >
                              Recusar
                            </button>
                            <button
                              type="button"
                              disabled={processandoId === visita._id}
                              onClick={() => atualizarStatusVisita(visita._id, 'confirmada')}
                              style={actionButton('#7ab894')}
                            >
                              Confirmar
                            </button>
                          </>
                        )}
                        {visita.status === 'confirmada' && (
                          <button
                            type="button"
                            disabled={processandoId === visita._id}
                            onClick={() => atualizarStatusVisita(visita._id, 'realizada')}
                            style={actionButton('#80a6c6')}
                          >
                            Marcar realizada
                          </button>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {casa && aba === 'candidaturas' && (
          <section style={cardStyle}>
            <h2 style={{ fontSize: '1.05rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
              Candidaturas recebidas
            </h2>
            {loading ? (
              <EstadoVazio texto="Carregando candidaturas..." />
            ) : candidaturas.length === 0 ? (
              <EstadoVazio texto="Nenhuma candidatura recebida." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {candidaturas.map(candidatura => {
                  const status = statusCandidatura[candidatura.status] || statusCandidatura.pendente
                  return (
                    <article key={candidatura._id} style={{
                      backgroundColor: 'var(--background)',
                      borderRadius: '14px',
                      padding: '1.25rem'
                    }}>
                      <div className="gestor-row" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '1rem'
                      }}>
                        <div>
                          <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>
                            {candidatura.assistidoId?.nome || 'Assistido'}
                          </strong>
                          <div style={{ color: 'var(--text)', opacity: 0.62, fontSize: '0.82rem', marginTop: '0.3rem' }}>
                            Para {candidatura.casaId?.nome || 'sua casa'} · Responsável: {candidatura.responsavelId?.nome || 'não informado'}
                          </div>
                          {candidatura.responsavelId?.telefone && (
                            <div style={{ color: 'var(--text)', opacity: 0.62, fontSize: '0.82rem', marginTop: '0.2rem' }}>
                              Contato: {candidatura.responsavelId.telefone}
                            </div>
                          )}
                        </div>
                        <span style={{
                          backgroundColor: `${status.cor}25`,
                          color: status.cor,
                          padding: '0.35rem 0.8rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: '700'
                        }}>
                          {status.label}
                        </span>
                      </div>
                      {candidatura.mensagem && (
                        <p style={{ color: 'var(--text)', opacity: 0.72, fontSize: '0.86rem', margin: '1rem 0 0' }}>
                          “{candidatura.mensagem}”
                        </p>
                      )}
                      {(candidatura.status === 'pendente' || candidatura.status === 'em_analise') && (
                        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
                          <button
                            type="button"
                            disabled={processandoId === candidatura._id}
                            onClick={() => responderCandidatura(candidatura._id, 'recusada')}
                            style={actionButton('#e87c7c')}
                          >
                            Recusar
                          </button>
                          <button
                            type="button"
                            disabled={processandoId === candidatura._id}
                            onClick={() => responderCandidatura(candidatura._id, 'aceita')}
                            style={actionButton('#7ab894')}
                          >
                            Aceitar
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {aba === 'casa' && (
          <section style={cardStyle}>
            <div className="gestor-row" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.25rem'
            }}>
              <h2 style={{ fontSize: '1.05rem', color: 'var(--text)' }}>Minha casa</h2>
              {!casa && (
                <button type="button" onClick={() => setAba('cadastrar')} style={actionButton('#395f7f')}>
                  Cadastrar casa
                </button>
              )}
            </div>
            {loading ? (
              <EstadoVazio texto="Carregando casa..." />
            ) : !casa ? (
              <EstadoVazio texto="Você ainda não cadastrou uma casa." />
            ) : (
              <article style={{
                backgroundColor: 'var(--background)',
                borderRadius: '14px',
                padding: '1.25rem'
              }}>
                <strong style={{ color: 'var(--text)', fontSize: '1rem' }}>{casa.nome}</strong>
                <div style={{ color: 'var(--text)', opacity: 0.6, fontSize: '0.82rem', marginTop: '0.35rem' }}>
                  {casa.endereco?.rua}, {casa.endereco?.numero} · {casa.endereco?.bairro}
                </div>
                <div style={{ color: 'var(--text)', opacity: 0.6, fontSize: '0.82rem', marginTop: '0.25rem' }}>
                  Capacidade: {casa.capacidade} · Vagas atuais: {casa.vagasDisponiveis}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'end', marginTop: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle} htmlFor={`vagas-${casa._id}`}>Atualizar vagas</label>
                    <input
                      id={`vagas-${casa._id}`}
                      type="number"
                      min="0"
                      max={casa.capacidade}
                      value={vagasEdicao}
                      onChange={event => setVagasEdicao(event.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={processandoId === casa._id}
                    onClick={atualizarVagas}
                    style={actionButton('#7ab894')}
                  >
                    Salvar
                  </button>
                </div>
              </article>
            )}
          </section>
        )}

        {aba === 'cadastrar' && !casa && (
          <section style={cardStyle}>
            <h2 style={{ fontSize: '1.05rem', color: 'var(--text)', marginBottom: '0.35rem' }}>
              Cadastrar nova casa
            </h2>
            <p style={{ color: 'var(--text)', opacity: 0.58, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              O endereço será geocodificado pelo backend para aparecer no mapa.
            </p>

            <form onSubmit={cadastrarCasa}>
              <div className="gestor-form-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '1.1rem'
              }}>
                <div className="gestor-full">
                  <label style={labelStyle} htmlFor="nome-casa">Nome da casa *</label>
                  <input id="nome-casa" name="nome" value={form.nome} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="tipo-casa">Tipo de atendimento *</label>
                  <select id="tipo-casa" name="tipo" value={form.tipo} onChange={handleChange} style={inputStyle}>
                    <option value="">Selecione...</option>
                    {tiposOpcoes.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="telefone-casa">Telefone</label>
                  <input id="telefone-casa" name="telefone" value={form.telefone} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="capacidade-casa">Capacidade *</label>
                  <input id="capacidade-casa" type="number" min="1" name="capacidade" value={form.capacidade} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="vagas-casa">Vagas disponíveis</label>
                  <input id="vagas-casa" type="number" min="0" name="vagasDisponiveis" value={form.vagasDisponiveis} onChange={handleChange} style={inputStyle} />
                </div>
                <div className="gestor-full">
                  <label style={labelStyle} htmlFor="descricao-casa">Descrição *</label>
                  <textarea id="descricao-casa" name="descricao" rows="4" value={form.descricao} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="cep-casa">
                    CEP * {buscandoCep && <span style={{ fontWeight: '400' }}>· buscando...</span>}
                  </label>
                  <input id="cep-casa" name="endereco.cep" maxLength="9" value={form.endereco.cep} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="rua-casa">Rua *</label>
                  <input id="rua-casa" name="endereco.rua" value={form.endereco.rua} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="numero-casa">Número *</label>
                  <input id="numero-casa" name="endereco.numero" value={form.endereco.numero} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="bairro-casa">Bairro *</label>
                  <input id="bairro-casa" name="endereco.bairro" value={form.endereco.bairro} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="cidade-casa">Cidade *</label>
                  <input id="cidade-casa" name="endereco.cidade" value={form.endereco.cidade} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="estado-casa">Estado *</label>
                  <input id="estado-casa" name="endereco.estado" maxLength="2" value={form.endereco.estado} onChange={handleChange} style={inputStyle} />
                </div>
                <div className="gestor-full">
                  <span style={labelStyle}>Serviços oferecidos</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {servicosOpcoes.map(servico => {
                      const selecionado = form.servicos.includes(servico.value)
                      return (
                        <button
                          type="button"
                          key={servico.value}
                          onClick={() => toggleServico(servico.value)}
                          style={{
                            padding: '0.42rem 0.85rem',
                            borderRadius: '999px',
                            border: `1px solid ${selecionado ? 'var(--primary)' : 'transparent'}`,
                            backgroundColor: selecionado ? 'var(--primary)' : 'var(--background)',
                            color: selecionado ? 'white' : 'var(--text)',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          {servico.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <button
                  className="gestor-full"
                  type="submit"
                  disabled={salvando}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '0.95rem',
                    borderRadius: '11px',
                    fontWeight: '800',
                    cursor: salvando ? 'not-allowed' : 'pointer',
                    opacity: salvando ? 0.7 : 1
                  }}
                >
                  {salvando ? 'Salvando no banco...' : 'Cadastrar casa'}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>

      <style>{`
        .gestor-full { grid-column: 1 / -1; }
        @media (max-width: 800px) {
          .gestor-page { padding: 1rem !important; }
          .gestor-header, .gestor-row { align-items: stretch !important; flex-direction: column; }
          .gestor-tabs {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .gestor-tabs button { width: 100%; }
          .gestor-stats { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .gestor-onboarding-steps { grid-template-columns: 1fr !important; }
          .gestor-house-grid, .gestor-form-grid { grid-template-columns: 1fr !important; }
          .gestor-form-grid > * { grid-column: 1 !important; }
        }
      `}</style>
    </main>
  )
}
