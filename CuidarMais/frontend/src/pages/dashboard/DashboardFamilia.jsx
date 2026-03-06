import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ModalAgendamento from '../../components/ui/ModalAgendamento'

const statusConfig = {
  pendente: { label: 'Pendente', cor: '#e8a87c' },
  confirmada: { label: 'Confirmada', cor: '#7ab894' },
  cancelada: { label: 'Cancelada', cor: '#e87c7c' },
  realizada: { label: 'Realizada', cor: '#80a6c6' }
}

const cores = {
  idosos: '#80a6c6',
  dependentes_quimicos: '#e8a87c',
  saude_mental: '#9b8fc4',
  vulnerabilidade_social: '#7ab894'
}

const casasFicticias = [
  {
    id: 1,
    nome: 'Casa Raio de Sol',
    bairro: 'Bodocongó',
    tipo: 'idosos',
    vagas: 8,
    avaliacao: 4.8,
    servicos: ['Enfermagem', 'Fisioterapia', 'Alimentação'],
    coords: { lat: -7.2172, lng: -35.9078 }
  },
  {
    id: 2,
    nome: 'Lar Recomeço',
    bairro: 'Mirante',
    tipo: 'dependentes_quimicos',
    vagas: 3,
    avaliacao: 4.6,
    servicos: ['Psicologia', 'Grupo de Apoio', 'Desintoxicação'],
    coords: { lat: -7.2050, lng: -35.8950 }
  },
  {
    id: 3,
    nome: 'Casa Bem Viver',
    bairro: 'Centro',
    tipo: 'idosos',
    vagas: 0,
    avaliacao: 4.9,
    servicos: ['Fisioterapia', 'Alimentação', 'Transporte'],
    coords: { lat: -7.2306, lng: -35.8811 }
  },
  {
    id: 4,
    nome: 'Casa Equilíbrio',
    bairro: 'Catolé',
    tipo: 'saude_mental',
    vagas: 5,
    avaliacao: 4.5,
    servicos: ['Psiquiatria', 'Terapia Ocupacional', 'Oficinas'],
    coords: { lat: -7.2450, lng: -35.8900 }
  },
  {
    id: 5,
    nome: 'Abrigo Esperança',
    bairro: 'Universitário',
    tipo: 'vulnerabilidade_social',
    vagas: 12,
    avaliacao: 4.7,
    servicos: ['Assistência Social', 'Alimentação', 'Documentação'],
    coords: { lat: -7.2180, lng: -35.9150 }
  }
]

const visitasFicticias = [
  {
    _id: '1',
    casaNome: 'Casa Raio de Sol',
    bairro: 'Bodocongó',
    data: '2026-03-15',
    horario: 'manha',
    status: 'confirmada',
    tipo: 'idosos'
  },
  {
    _id: '2',
    casaNome: 'Casa Equilíbrio',
    bairro: 'Catolé',
    data: '2026-02-28',
    horario: 'tarde',
    status: 'realizada',
    tipo: 'saude_mental'
  },
  {
    _id: '3',
    casaNome: 'Abrigo Esperança',
    bairro: 'Universitário',
    data: '2026-03-22',
    horario: 'manha',
    status: 'pendente',
    tipo: 'vulnerabilidade_social'
  }
]

export default function DashboardFamilia() {
  const { usuario } = useAuth()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [casaSelecionada, setCasaSelecionada] = useState(null)
  const [modalCasa, setModalCasa] = useState(null)

  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return
    const L = window.L
    if (!L) return

    const map = L.map(mapRef.current, {
      center: [-7.2306, -35.8811],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map)

    casasFicticias.forEach(casa => {
      const corPin = casa.vagas > 0 ? (cores[casa.tipo] || '#80a6c6') : '#d1c2b3'

      const icone = L.divIcon({
        html: `
          <div style="
            background: ${corPin};
            width: 32px; height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
            display: flex; align-items: center; justify-content: center;
          ">
            <div style="transform: rotate(45deg); color: white; font-size: 13px; font-weight: bold;">+</div>
          </div>
        `,
        className: '',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      })

      L.marker([casa.coords.lat, casa.coords.lng], { icon: icone })
        .addTo(map)
        .on('click', () => setCasaSelecionada(casa))
    })

    mapInstanceRef.current = map
  }, [])

  const proximaVisita = visitasFicticias.find(v => v.status === 'confirmada' || v.status === 'pendente')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.2rem' }}>
              Olá, {usuario.nome.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.6, fontSize: '0.95rem' }}>
              Bem-vindo ao seu painel — acompanhe tudo por aqui
            </p>
          </div>
          <div style={{
            backgroundColor: 'var(--secondary)',
            borderRadius: '12px',
            padding: '0.6rem 1.1rem',
            fontSize: '0.85rem',
            color: 'var(--text)',
            opacity: 0.7
          }}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
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
            { label: 'Visitas agendadas', valor: 2, cor: '#80a6c6', emoji: '📅' },
            { label: 'Visitas realizadas', valor: 1, cor: '#7ab894', emoji: '✅' },
            { label: 'Casas visitadas', valor: 2, cor: '#9b8fc4', emoji: '🏠' },
            { label: 'Avaliações feitas', valor: 1, cor: '#e8a87c', emoji: '⭐' }
          ].map(stat => (
            <div key={stat.label} style={{
              backgroundColor: 'var(--secondary)',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ fontSize: '1.5rem' }}>{stat.emoji}</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: stat.cor, lineHeight: 1 }}>
                {stat.valor}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.6 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mapa + Sidebar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: '1.5rem',
          marginBottom: '2rem',
          alignItems: 'start'
        }}>

          {/* Mapa */}
          <div style={{
            backgroundColor: 'var(--secondary)',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.15rem' }}>
                  Casas próximas
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.5 }}>
                  Clique nos pins para ver detalhes
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { cor: '#80a6c6', label: 'Idosos' },
                  { cor: '#9b8fc4', label: 'Saúde mental' },
                  { cor: '#7ab894', label: 'Social' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: l.cor }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text)', opacity: 0.6 }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ height: '380px', position: 'relative' }}>
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

              {/* Card popup do pin */}
              {casaSelecionada && (
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  left: '1rem',
                  right: '1rem',
                  backgroundColor: 'var(--background)',
                  borderRadius: '14px',
                  padding: '1rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '10px',
                      backgroundColor: cores[casaSelecionada.tipo] + '25',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cores[casaSelecionada.tipo]} strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text)' }}>
                        {casaSelecionada.nome}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.6 }}>
                        {casaSelecionada.bairro} · {casaSelecionada.vagas > 0 ? `${casaSelecionada.vagas} vagas` : 'Sem vagas'} · ⭐ {casaSelecionada.avaliacao}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setCasaSelecionada(null)}
                      style={{
                        backgroundColor: 'var(--secondary)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.82rem',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Fechar
                    </button>
                    <button
                      onClick={() => setModalCasa(casaSelecionada)}
                      style={{
                        backgroundColor: 'var(--primary)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.82rem',
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Agendar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar direita */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Próxima visita */}
            {proximaVisita && (
              <div style={{
                backgroundColor: 'var(--secondary)',
                borderRadius: '20px',
                padding: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: 'var(--text)',
                  opacity: 0.5,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '1rem'
                }}>
                  Próxima visita
                </h2>
                <div style={{
                  backgroundColor: 'var(--background)',
                  borderRadius: '14px',
                  padding: '1.25rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor: statusConfig[proximaVisita.status].cor
                    }} />
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      color: statusConfig[proximaVisita.status].cor
                    }}>
                      {statusConfig[proximaVisita.status].label}
                    </span>
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.3rem' }}>
                    {proximaVisita.casaNome}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.6 }}>
                    {new Date(proximaVisita.data).toLocaleDateString('pt-BR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.6 }}>
                    {proximaVisita.horario === 'manha' ? '☀️ Manhã (08h–12h)' : '🌤️ Tarde (13h–17h)'}
                  </div>
                </div>
              </div>
            )}

            {/* Casa recomendada */}
            <div style={{
              backgroundColor: 'var(--secondary)',
              borderRadius: '20px',
              padding: '1.5rem'
            }}>
              <h2 style={{
                fontSize: '0.9rem',
                fontWeight: '700',
                color: 'var(--text)',
                opacity: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '1rem'
              }}>
                Recomendada para você
              </h2>
              <div style={{
                backgroundColor: 'var(--background)',
                borderRadius: '14px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100px',
                  background: `linear-gradient(135deg, ${cores.idosos}88, ${cores.saude_mental}88)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem'
                }}>
                  🏡
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: '700', color: 'var(--text)', marginBottom: '0.2rem' }}>
                    Casa Raio de Sol
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.6, marginBottom: '0.75rem' }}>
                    Bodocongó · ⭐ 4.8 · 8 vagas
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {['Enfermagem', 'Fisioterapia'].map(s => (
                      <span key={s} style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--text)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setModalCasa(casasFicticias[0])}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      padding: '0.65rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Agendar visita
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico de visitas */}
        <div style={{
          backgroundColor: 'var(--secondary)',
          borderRadius: '20px',
          padding: '1.75rem'
        }}>
          <h2 style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: 'var(--text)',
            marginBottom: '1.25rem'
          }}>
            Histórico de visitas
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {visitasFicticias.map(visita => {
              const status = statusConfig[visita.status]
              return (
                <div key={visita._id} style={{
                  backgroundColor: 'var(--background)',
                  borderRadius: '14px',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '10px',
                      backgroundColor: cores[visita.tipo] + '25',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cores[visita.tipo]} strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.15rem' }}>
                        {visita.casaNome}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.55 }}>
                        {new Date(visita.data).toLocaleDateString('pt-BR')} · {visita.bairro} · {visita.horario === 'manha' ? 'Manhã' : 'Tarde'}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: status.cor + '25',
                    color: status.cor,
                    padding: '0.3rem 0.9rem',
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
        </div>
      </div>

      {/* Modal */}
      {modalCasa && (
        <ModalAgendamento
          casa={modalCasa}
          onFechar={() => setModalCasa(null)}
        />
      )}
    </div>
  )
}