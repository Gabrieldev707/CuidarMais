import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const condicoesList = [
  'Diabetes', 'Hipertensão', 'Demência', 'Alzheimer',
  'Mobilidade reduzida', 'Acamado', 'Incontinência',
  'Depressão', 'Parkinson', 'AVC'
]

export default function ModalAgendamento({ casa, onFechar }) {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState('')

  const [form, setForm] = useState({
    nomeIdoso: '',
    dataNascimento: '',
    dependencia: '',
    condicoes: [],
    observacoes: '',
    dataVisita: '',
    horario: '',
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleCondicao = (condicao) => {
    setForm(prev => ({
      ...prev,
      condicoes: prev.condicoes.includes(condicao)
        ? prev.condicoes.filter(c => c !== condicao)
        : [...prev.condicoes, condicao]
    }))
  }

  const handleSubmit = async () => {
    if (!usuario) {
      navigate('/login')
      return
    }
    setLoading(true)
    setErro('')
    try {
      await api.post('/visitas', {
        casaId: casa.id,
        data: form.dataVisita,
        horario: form.horario,
        observacoes: `Idoso: ${form.nomeIdoso} | Nascimento: ${form.dataNascimento} | Dependência: ${form.dependencia} | Condições: ${form.condicoes.join(', ')} | Obs: ${form.observacoes}`
      })
      setSucesso(true)
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao agendar visita')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: '2px solid transparent',
    backgroundColor: 'var(--background)',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.88rem',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '0.4rem',
    opacity: 0.8
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onFechar()}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
    >
      <div style={{
        backgroundColor: 'var(--background)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.2)'
      }}>

        {/* Header */}
        <div style={{
          padding: '1.75rem 2rem 1.25rem',
          borderBottom: '1px solid var(--secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--background)',
          zIndex: 1,
          borderRadius: '24px 24px 0 0'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: '700',
              color: 'var(--text)',
              marginBottom: '0.2rem'
            }}>
              Agendar Visita
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.6 }}>
              {casa.nome} · {casa.bairro}
            </p>
          </div>
          <button onClick={onFechar} style={{
            background: 'var(--secondary)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text)',
            flexShrink: 0
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Barra de progresso */}
        {!sucesso && (
          <div style={{ padding: '1rem 2rem', display: 'flex', gap: '0.5rem' }}>
            {[1, 2].map(n => (
              <div key={n} style={{
                flex: 1,
                height: '4px',
                borderRadius: '100px',
                backgroundColor: etapa >= n ? 'var(--primary)' : 'var(--secondary)',
                transition: 'background 0.3s'
              }} />
            ))}
          </div>
        )}

        <div style={{ padding: '1rem 2rem 2rem' }}>

          {/* Tela de sucesso */}
          {sucesso ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{
                width: '72px', height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '0.75rem'
              }}>
                Visita agendada!
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text)',
                opacity: 0.65,
                lineHeight: '1.6',
                marginBottom: '2rem'
              }}>
                O gestor da {casa.nome} vai confirmar sua visita em breve. Acompanhe pelo dashboard.
              </p>
              <button onClick={onFechar} style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '0.85rem 2rem',
                borderRadius: '12px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Fechar
              </button>
            </div>

          ) : etapa === 1 ? (
            /* Etapa 1 — Dados do assistido */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--text)', fontSize: '1rem' }}>
                  Dados do assistido
                </span>
              </div>

              <div>
                <label style={labelStyle}>Nome completo</label>
                <input
                  type="text"
                  name="nomeIdoso"
                  value={form.nomeIdoso}
                  onChange={handleChange}
                  placeholder="Nome do assistido"
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              <div>
                <label style={labelStyle}>Data de nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={form.dataNascimento}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              <div>
                <label style={labelStyle}>Nível de dependência</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { value: 'independente', label: 'Independente', desc: 'Realiza atividades sozinho' },
                    { value: 'parcial', label: 'Parcialmente dependente', desc: 'Precisa de alguma ajuda' },
                    { value: 'total', label: 'Totalmente dependente', desc: 'Precisa de cuidado integral' }
                  ].map(op => (
                    <div
                      key={op.value}
                      onClick={() => setForm(prev => ({ ...prev, dependencia: op.value }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        backgroundColor: form.dependencia === op.value ? 'var(--accent)' : 'var(--secondary)',
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: form.dependencia === op.value ? 'var(--primary)' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{
                        width: '18px', height: '18px',
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: form.dependencia === op.value ? 'var(--primary)' : 'var(--text)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {form.dependencia === op.value && (
                          <div style={{
                            width: '8px', height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)'
                          }} />
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text)' }}>
                          {op.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text)', opacity: 0.6 }}>
                          {op.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Condições de saúde</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {condicoesList.map(c => (
                    <button
                      key={c}
                      onClick={() => toggleCondicao(c)}
                      style={{
                        padding: '0.4rem 0.9rem',
                        borderRadius: '100px',
                        border: '2px solid',
                        borderColor: form.condicoes.includes(c) ? 'var(--primary)' : 'transparent',
                        backgroundColor: form.condicoes.includes(c) ? 'var(--accent)' : 'var(--secondary)',
                        color: 'var(--text)',
                        fontSize: '0.82rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Observações importantes</label>
                <textarea
                  name="observacoes"
                  value={form.observacoes}
                  onChange={handleChange}
                  placeholder="Informações adicionais que o gestor deve saber..."
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              <button
                onClick={() => setEtapa(2)}
                disabled={!form.nomeIdoso || !form.dataNascimento || !form.dependencia}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.9rem',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: !form.nomeIdoso || !form.dataNascimento || !form.dependencia ? 'not-allowed' : 'pointer',
                  opacity: !form.nomeIdoso || !form.dataNascimento || !form.dependencia ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                Próximo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>

          ) : (
            /* Etapa 2 — Data e horário */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <span style={{ fontWeight: '700', color: 'var(--text)', fontSize: '1rem' }}>
                  Data e horário
                </span>
              </div>

              <div>
                <label style={labelStyle}>Data desejada para a visita</label>
                <input
                  type="date"
                  name="dataVisita"
                  value={form.dataVisita}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  style={inputStyle}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'}
                />
              </div>

              <div>
                <label style={labelStyle}>Horário preferido</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { value: 'manha', label: 'Manhã', desc: '08h às 12h' },
                    { value: 'tarde', label: 'Tarde', desc: '13h às 17h' }
                  ].map(h => (
                    <div
                      key={h.value}
                      onClick={() => setForm(prev => ({ ...prev, horario: h.value }))}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        backgroundColor: form.horario === h.value ? 'var(--accent)' : 'var(--secondary)',
                        border: '2px solid',
                        borderColor: form.horario === h.value ? 'var(--primary)' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.2rem' }}>
                        {h.label}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.6 }}>
                        {h.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div style={{
                backgroundColor: 'var(--secondary)',
                borderRadius: '14px',
                padding: '1.25rem'
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  color: 'var(--text)',
                  opacity: 0.5,
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Resumo
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    { label: 'Assistido', valor: form.nomeIdoso },
                    { label: 'Dependência', valor: form.dependencia },
                    { label: 'Condições', valor: form.condicoes.length > 0 ? form.condicoes.join(', ') : 'Nenhuma' },
                    { label: 'Casa', valor: casa.nome }
                  ].map(item => (
                    <div key={item.label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.88rem'
                    }}>
                      <span style={{ color: 'var(--text)', opacity: 0.6 }}>{item.label}</span>
                      <span style={{
                        color: 'var(--text)',
                        fontWeight: '600',
                        textAlign: 'right',
                        maxWidth: '60%'
                      }}>
                        {item.valor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {erro && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem'
                }}>
                  {erro}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setEtapa(1)}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--text)',
                    border: 'none',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.dataVisita || !form.horario || loading}
                  style={{
                    flex: 2,
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '0.9rem',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: !form.dataVisita || !form.horario ? 'not-allowed' : 'pointer',
                    opacity: !form.dataVisita || !form.horario ? 0.5 : 1
                  }}
                >
                  {loading ? 'Agendando...' : 'Confirmar visita'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}