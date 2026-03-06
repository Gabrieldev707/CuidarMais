import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const statusConfig = {
  pendente: { label: 'Pendente', cor: '#e8a87c' },
  confirmada: { label: 'Confirmada', cor: '#7ab894' },
  cancelada: { label: 'Cancelada', cor: '#e87c7c' },
  realizada: { label: 'Realizada', cor: '#80a6c6' }
}

const tiposOpcoes = [
  { value: 'idosos', label: 'Idosos' },
  { value: 'dependentes_quimicos', label: 'Dependência química' },
  { value: 'saude_mental', label: 'Saúde mental' },
  { value: 'vulnerabilidade_social', label: 'Vulnerabilidade social' }
]

const servicosOpcoes = [
  'Enfermagem', 'Fisioterapia', 'Alimentação', 'Transporte',
  'Psicologia', 'Psiquiatria', 'Grupo de Apoio', 'Desintoxicação',
  'Terapia Ocupacional', 'Oficinas', 'Assistência Social',
  'Documentação', 'Capacitação Profissional', 'Recreação'
]

const formInicial = {
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
}

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
  fontFamily: 'inherit',
  transition: 'border 0.2s'
}

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: '600',
  color: 'var(--text)',
  opacity: 0.7,
  marginBottom: '0.35rem'
}

export default function DashboardGestor() {
  const { usuario } = useAuth()
  const [aba, setAba] = useState('visitas') // 'visitas' | 'cadastrar'
  const [visitas, setVisitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(formInicial)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)

  useEffect(() => {
    api.get('/visitas/minhas')
      .then(({ data }) => setVisitas(data.visitas))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const atualizarStatus = async (id, status) => {
    try {
      await api.patch(`/visitas/${id}/status`, { status })
      setVisitas(prev => prev.map(v => v._id === id ? { ...v, status } : v))
    } catch (err) {
      console.error(err)
    }
  }

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8) return
    setBuscandoCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await res.json()
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
    } catch (e) {
      console.error('Erro ao buscar CEP:', e)
    } finally {
      setBuscandoCep(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('endereco.')) {
      const campo = name.split('.')[1]
      setForm(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [campo]: value }
      }))
      if (campo === 'cep') buscarCep(value)
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const toggleServico = (s) => {
    setForm(prev => ({
      ...prev,
      servicos: prev.servicos.includes(s)
        ? prev.servicos.filter(x => x !== s)
        : [...prev.servicos, s]
    }))
  }

  const handleSubmit = async () => {
    setErro('')
    if (!form.nome || !form.tipo || !form.capacidade || !form.endereco.rua || !form.endereco.cep) {
      setErro('Preencha os campos obrigatórios: nome, tipo, capacidade e endereço.')
      return
    }
    setSalvando(true)
    try {
      await api.post('/casas', {
        ...form,
        capacidade: Number(form.capacidade),
        vagasDisponiveis: Number(form.vagasDisponiveis || form.capacidade)
      })
      setSucesso(true)
      setForm(formInicial)
      setTimeout(() => setSucesso(false), 4000)
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao cadastrar casa')
    } finally {
      setSalvando(false)
    }
  }

  const pendentes = visitas.filter(v => v.status === 'pendente')
  const confirmadas = visitas.filter(v => v.status === 'confirmada')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.2rem' }}>
              Painel do Gestor
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.6, fontSize: '0.95rem' }}>
              Olá, {usuario.nome.split(' ')[0]} — gerencie sua casa e visitas
            </p>
          </div>

          {/* Abas */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--secondary)',
            borderRadius: '12px',
            padding: '0.3rem',
            gap: '0.25rem'
          }}>
            {[
              {
                key: 'visitas', label: 'Visitas',
                icone: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                )
              },
              {
                key: 'cadastrar', label: 'Cadastrar Casa',
                icone: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                )
              }
            ].map(a => (
              <button
                key={a.key}
                onClick={() => setAba(a.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  backgroundColor: aba === a.key ? 'var(--background)' : 'transparent',
                  color: aba === a.key ? 'var(--primary)' : 'var(--text)',
                  boxShadow: aba === a.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {a.icone}
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Pendentes', valor: pendentes.length, cor: '#e8a87c' },
            { label: 'Confirmadas', valor: confirmadas.length, cor: '#7ab894' },
            { label: 'Realizadas', valor: visitas.filter(v => v.status === 'realizada').length, cor: '#80a6c6' },
            { label: 'Total', valor: visitas.length, cor: '#9b8fc4' }
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: 'var(--secondary)',
              borderRadius: '16px',
              padding: '1.25rem',
              borderLeft: `4px solid ${stat.cor}`
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: stat.cor, lineHeight: 1, marginBottom: '0.3rem' }}>
                {stat.valor}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.6 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ABA VISITAS */}
        {aba === 'visitas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Pendentes */}
            {pendentes.length > 0 && (
              <div style={{ backgroundColor: 'var(--secondary)', borderRadius: '20px', padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e8a87c' }} />
                  <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)' }}>
                    Visitas pendentes ({pendentes.length})
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendentes.map(visita => (
                    <div key={visita._id} style={{
                      backgroundColor: 'var(--background)',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                        <div style={{
                          width: '42px', height: '42px',
                          borderRadius: '10px',
                          backgroundColor: '#e8a87c25',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#e8a87c', flexShrink: 0
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                          </svg>
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.2rem' }}>
                            {visita.responsavelId?.nome || 'Responsável'}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.6 }}>
                            {visita.data ? new Date(visita.data).toLocaleDateString('pt-BR') : 'Data não definida'}
                            {' · '}{visita.horario === 'manha' ? 'Manhã' : 'Tarde'}
                          </div>
                          {visita.observacoes && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.5, marginTop: '0.2rem', maxWidth: '380px' }}>
                              {visita.observacoes.substring(0, 90)}...
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          onClick={() => atualizarStatus(visita._id, 'cancelada')}
                          style={{
                            backgroundColor: '#e87c7c25', color: '#e87c7c',
                            border: 'none', padding: '0.5rem 1rem', borderRadius: '8px',
                            fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
                          }}
                        >
                          Recusar
                        </button>
                        <button
                          onClick={() => atualizarStatus(visita._id, 'confirmada')}
                          style={{
                            backgroundColor: '#7ab89425', color: '#7ab894',
                            border: 'none', padding: '0.5rem 1rem', borderRadius: '8px',
                            fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer'
                          }}
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Todas as visitas */}
            <div style={{ backgroundColor: 'var(--secondary)', borderRadius: '20px', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)', marginBottom: '1.25rem' }}>
                Todas as visitas
              </h2>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text)', opacity: 0.5 }}>
                  Carregando...
                </div>
              ) : visitas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    backgroundColor: 'var(--background)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', color: 'var(--text)', opacity: 0.3
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <p style={{ color: 'var(--text)', opacity: 0.5, fontSize: '0.9rem' }}>
                    Nenhuma visita ainda
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {visitas.map(visita => {
                    const status = statusConfig[visita.status] || statusConfig.pendente
                    return (
                      <div key={visita._id} style={{
                        backgroundColor: 'var(--background)',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                            {visita.responsavelId?.nome || 'Responsável'}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.6 }}>
                            {visita.data ? new Date(visita.data).toLocaleDateString('pt-BR') : 'Data não definida'}
                            {' · '}{visita.horario === 'manha' ? 'Manhã' : 'Tarde'}
                          </div>
                        </div>
                        <div style={{
                          backgroundColor: status.cor + '25', color: status.cor,
                          padding: '0.3rem 0.85rem', borderRadius: '100px',
                          fontSize: '0.8rem', fontWeight: '700'
                        }}>
                          {status.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA CADASTRAR CASA */}
        {aba === 'cadastrar' && (
          <div style={{ backgroundColor: 'var(--secondary)', borderRadius: '20px', padding: '2rem' }}>

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.3rem' }}>
                Cadastrar nova casa
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text)', opacity: 0.55 }}>
                O endereço será convertido automaticamente em coordenadas para o mapa
              </p>
            </div>

            {sucesso && (
              <div style={{
                backgroundColor: '#7ab89420',
                border: '1.5px solid #7ab894',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#7ab894',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7ab894" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Casa cadastrada com sucesso! Já aparece no mapa.
              </div>
            )}

            {erro && (
              <div style={{
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}>
                {erro}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

              {/* Nome */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nome da casa *</label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  placeholder="Ex: Casa Raio de Sol"
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Tipo */}
              <div>
                <label style={labelStyle}>Tipo de atendimento *</label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                >
                  <option value="">Selecione...</option>
                  {tiposOpcoes.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Telefone */}
              <div>
                <label style={labelStyle}>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  placeholder="(83) 99999-9999"
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Capacidade */}
              <div>
                <label style={labelStyle}>Capacidade total *</label>
                <input
                  type="number"
                  name="capacidade"
                  value={form.capacidade}
                  onChange={handleChange}
                  placeholder="Ex: 20"
                  min="1"
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Vagas disponíveis */}
              <div>
                <label style={labelStyle}>Vagas disponíveis</label>
                <input
                  type="number"
                  name="vagasDisponiveis"
                  value={form.vagasDisponiveis}
                  onChange={handleChange}
                  placeholder="Padrão: igual à capacidade"
                  min="0"
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Descrição */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descrição</label>
                <textarea
                  name="descricao"
                  value={form.descricao}
                  onChange={handleChange}
                  placeholder="Descreva a casa, sua missão e diferenciais..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Divisor endereço */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  margin: '0.5rem 0'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--background)' }} />
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    color: 'var(--text)',
                    opacity: 0.4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Endereço
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--background)' }} />
                </div>
              </div>

              {/* CEP */}
              <div>
                <label style={labelStyle}>
                  CEP *
                  {buscandoCep && (
                    <span style={{ marginLeft: '0.5rem', opacity: 0.5, fontWeight: '400' }}>
                      Buscando...
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="endereco.cep"
                  value={form.endereco.cep}
                  onChange={handleChange}
                  placeholder="58000-000"
                  maxLength={9}
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Rua */}
              <div>
                <label style={labelStyle}>Rua *</label>
                <input
                  type="text"
                  name="endereco.rua"
                  value={form.endereco.rua}
                  onChange={handleChange}
                  placeholder="Preenchido automaticamente pelo CEP"
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Número */}
              <div>
                <label style={labelStyle}>Número</label>
                <input
                  type="text"
                  name="endereco.numero"
                  value={form.endereco.numero}
                  onChange={handleChange}
                  placeholder="Ex: 123"
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Bairro */}
              <div>
                <label style={labelStyle}>Bairro</label>
                <input
                  type="text"
                  name="endereco.bairro"
                  value={form.endereco.bairro}
                  onChange={handleChange}
                  placeholder="Preenchido automaticamente pelo CEP"
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Cidade */}
              <div>
                <label style={labelStyle}>Cidade</label>
                <input
                  type="text"
                  name="endereco.cidade"
                  value={form.endereco.cidade}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              {/* Serviços */}
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  margin: '0.5rem 0 1rem'
                }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--background)' }} />
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    color: 'var(--text)',
                    opacity: 0.4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Serviços oferecidos
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--background)' }} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {servicosOpcoes.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleServico(s)}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: '100px',
                        border: '2px solid',
                        borderColor: form.servicos.includes(s) ? 'var(--primary)' : 'transparent',
                        backgroundColor: form.servicos.includes(s) ? 'var(--accent)' : 'var(--background)',
                        color: 'var(--text)',
                        fontSize: '0.82rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botão */}
              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                <button
                  onClick={handleSubmit}
                  disabled={salvando}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: salvando ? 'not-allowed' : 'pointer',
                    opacity: salvando ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.2s'
                  }}
                >
                  {salvando ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Cadastrar casa
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}