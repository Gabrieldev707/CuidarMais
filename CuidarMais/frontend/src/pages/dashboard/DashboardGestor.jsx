import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const statusConfig = {
  pendente: { label: 'Pendente', cor: '#e8a87c' },
  confirmada: { label: 'Confirmada', cor: '#7ab894' },
  cancelada: { label: 'Cancelada', cor: '#e87c7c' },
  realizada: { label: 'Realizada', cor: '#80a6c6' }
}

export default function DashboardGestor() {
  const { usuario } = useAuth()
  const [visitas, setVisitas] = useState([])
  const [loading, setLoading] = useState(true)

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

  const pendentes = visitas.filter(v => v.status === 'pendente')
  const confirmadas = visitas.filter(v => v.status === 'confirmada')

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            color: 'var(--text)',
            marginBottom: '0.25rem'
          }}>
            Painel do Gestor
          </h1>
          <p style={{ color: 'var(--text)', opacity: 0.6, fontSize: '0.95rem' }}>
            Olá, {usuario.nome.split(' ')[0]} — gerencie as visitas da sua casa
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.25rem',
          marginBottom: '2.5rem'
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
              padding: '1.5rem',
              borderLeft: `4px solid ${stat.cor}`
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: '800',
                color: stat.cor,
                lineHeight: 1,
                marginBottom: '0.3rem'
              }}>
                {stat.valor}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--text)',
                opacity: 0.6
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Visitas pendentes */}
        {pendentes.length > 0 && (
          <div style={{
            backgroundColor: 'var(--secondary)',
            borderRadius: '20px',
            padding: '1.75rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                width: '10px', height: '10px',
                borderRadius: '50%',
                backgroundColor: '#e8a87c'
              }} />
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: 'var(--text)'
              }}>
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
                  <div>
                    <div style={{
                      fontWeight: '700',
                      color: 'var(--text)',
                      marginBottom: '0.25rem'
                    }}>
                      {visita.responsavelId?.nome || 'Responsável'}
                    </div>
                    <div style={{
                      fontSize: '0.82rem',
                      color: 'var(--text)',
                      opacity: 0.6
                    }}>
                      {visita.data
                        ? new Date(visita.data).toLocaleDateString('pt-BR')
                        : 'Data não definida'
                      } · {visita.horario === 'manha' ? 'Manhã' : 'Tarde'}
                    </div>
                    {visita.observacoes && (
                      <div style={{
                        fontSize: '0.82rem',
                        color: 'var(--text)',
                        opacity: 0.5,
                        marginTop: '0.3rem',
                        maxWidth: '400px'
                      }}>
                        {visita.observacoes.substring(0, 100)}...
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                      onClick={() => atualizarStatus(visita._id, 'cancelada')}
                      style={{
                        backgroundColor: '#e87c7c25',
                        color: '#e87c7c',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Recusar
                    </button>
                    <button
                      onClick={() => atualizarStatus(visita._id, 'confirmada')}
                      style={{
                        backgroundColor: '#7ab89425',
                        color: '#7ab894',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer'
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
        <div style={{
          backgroundColor: 'var(--secondary)',
          borderRadius: '20px',
          padding: '1.75rem'
        }}>
          <h2 style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '1.5rem'
          }}>
            Todas as visitas
          </h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text)', opacity: 0.5 }}>
              Carregando...
            </div>
          ) : visitas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text)', opacity: 0.5 }}>
              Nenhuma visita ainda
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
                      <div style={{
                        fontWeight: '600',
                        color: 'var(--text)',
                        fontSize: '0.95rem',
                        marginBottom: '0.2rem'
                      }}>
                        {visita.responsavelId?.nome || 'Responsável'}
                      </div>
                      <div style={{
                        fontSize: '0.82rem',
                        color: 'var(--text)',
                        opacity: 0.6
                      }}>
                        {visita.data
                          ? new Date(visita.data).toLocaleDateString('pt-BR')
                          : 'Data não definida'
                        } · {visita.horario === 'manha' ? 'Manhã' : 'Tarde'}
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: status.cor + '25',
                      color: status.cor,
                      padding: '0.3rem 0.85rem',
                      borderRadius: '100px',
                      fontSize: '0.8rem',
                      fontWeight: '700'
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
    </div>
  )
}