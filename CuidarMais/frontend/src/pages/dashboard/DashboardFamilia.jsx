import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const statusConfig = {
  pendente: { label: 'Pendente', cor: '#e8a87c' },
  confirmada: { label: 'Confirmada', cor: '#7ab894' },
  cancelada: { label: 'Cancelada', cor: '#e87c7c' },
  realizada: { label: 'Realizada', cor: '#80a6c6' }
}

export default function DashboardFamilia() {
  const { usuario } = useAuth()
  const [visitas, setVisitas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/visitas/minhas')
      .then(({ data }) => setVisitas(data.visitas))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: '800',
              color: 'var(--text)',
              marginBottom: '0.25rem'
            }}>
              Olá, {usuario.nome.split(' ')[0]}
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.6, fontSize: '0.95rem' }}>
              Acompanhe suas visitas e encontre novas casas
            </p>
          </div>
          <Link to="/#mapa" style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Buscar casas
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {[
            {
              label: 'Visitas agendadas',
              valor: visitas.filter(v => v.status === 'pendente' || v.status === 'confirmada').length,
              cor: '#80a6c6',
              icone: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              )
            },
            {
              label: 'Visitas realizadas',
              valor: visitas.filter(v => v.status === 'realizada').length,
              cor: '#7ab894',
              icone: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )
            },
            {
              label: 'Total de visitas',
              valor: visitas.length,
              cor: '#9b8fc4',
              icone: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              )
            }
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: 'var(--secondary)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: stat.cor + '25',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.cor,
                flexShrink: 0
              }}>
                {stat.icone}
              </div>
              <div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: 'var(--text)',
                  lineHeight: 1
                }}>
                  {stat.valor}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text)',
                  opacity: 0.6,
                  marginTop: '0.2rem'
                }}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visitas */}
        <div style={{
          backgroundColor: 'var(--secondary)',
          borderRadius: '20px',
          padding: '1.75rem'
        }}>
          <h2 style={{
            fontSize: '1.15rem',
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '1.5rem'
          }}>
            Minhas visitas
          </h2>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text)',
              opacity: 0.5
            }}>
              Carregando...
            </div>
          ) : visitas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--background)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'var(--text)',
                opacity: 0.4
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p style={{
                color: 'var(--text)',
                opacity: 0.5,
                fontSize: '0.95rem',
                marginBottom: '1rem'
              }}>
                Você ainda não agendou nenhuma visita
              </p>
              <Link to="/#mapa" style={{
                color: 'var(--primary)',
                fontWeight: '600',
                textDecoration: 'none',
                fontSize: '0.95rem'
              }}>
                Explorar casas no mapa
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {visitas.map(visita => {
                const status = statusConfig[visita.status] || statusConfig.pendente
                return (
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--primary)' + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary)',
                        flexShrink: 0
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{
                          fontWeight: '700',
                          color: 'var(--text)',
                          fontSize: '0.95rem',
                          marginBottom: '0.2rem'
                        }}>
                          {visita.casaId?.nome || 'Casa não encontrada'}
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
                    </div>

                    <div style={{
                      backgroundColor: status.cor + '25',
                      color: status.cor,
                      padding: '0.35rem 0.9rem',
                      borderRadius: '100px',
                      fontSize: '0.82rem',
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