import { useEffect, useRef, useState } from 'react'
import ModalAgendamento from '../../../components/ui/ModalAgendamento'

const cores = {
  idosos: '#80a6c6',
  dependentes_quimicos: '#e8a87c',
  saude_mental: '#9b8fc4',
  vulnerabilidade_social: '#7ab894'
}

const tipoLabel = {
  idosos: 'Idosos',
  dependentes_quimicos: 'Dependência química',
  saude_mental: 'Saúde mental',
  vulnerabilidade_social: 'Vulnerabilidade social'
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

export default function MapaPreview() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [casaSelecionada, setCasaSelecionada] = useState(null)
  const [modalCasa, setModalCasa] = useState(null)

  useEffect(() => {
    if (mapInstanceRef.current) return

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
      const corPin = casa.vagas > 0
        ? (cores[casa.tipo] || '#80a6c6')
        : '#d1c2b3'

      const icone = L.divIcon({
        html: `
          <div style="
            background: ${corPin};
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              color: white;
              font-size: 14px;
              font-weight: bold;
            ">+</div>
          </div>
        `,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      })

      const marker = L.marker([casa.coords.lat, casa.coords.lng], { icon: icone })
        .addTo(map)

      marker.on('click', () => {
        setCasaSelecionada(casa)
      })
    })

    mapInstanceRef.current = map
  }, [])

  return (
    <section id="mapa" style={{
      padding: '6rem 2rem',
      backgroundColor: 'var(--secondary)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'var(--accent)',
            color: 'var(--text)',
            padding: '0.4rem 1rem',
            borderRadius: '100px',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1rem'
          }}>
            Explore sua cidade
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--text)',
            letterSpacing: '-0.5px',
            marginBottom: '1rem'
          }}>
            Casas de apoio em Campina Grande
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text)',
            opacity: 0.6,
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            Clique nos pins para ver detalhes de cada casa
          </p>
        </div>

        {/* Mapa + Card */}
        <div className={`mapa-layout ${casaSelecionada ? 'com-card' : 'sem-card'}`}>

          {/* Mapa */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            height: '500px'
          }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </div>

          {/* Card lateral */}
          {casaSelecionada && (
            <div style={{
              backgroundColor: 'var(--background)',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--text)',
                    marginBottom: '0.25rem'
                  }}>
                    {casaSelecionada.nome}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--text)',
                    opacity: 0.6,
                    fontSize: '0.9rem'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {casaSelecionada.bairro}
                  </div>
                </div>

                <button
                  onClick={() => setCasaSelecionada(null)}
                  style={{
                    background: 'var(--secondary)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Badge tipo */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: cores[casaSelecionada.tipo] + '30',
                color: cores[casaSelecionada.tipo],
                padding: '0.3rem 0.75rem',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: '600',
                width: 'fit-content'
              }}>
                <div style={{
                  width: '8px', height: '8px',
                  borderRadius: '50%',
                  backgroundColor: cores[casaSelecionada.tipo]
                }} />
                {tipoLabel[casaSelecionada.tipo]}
              </div>

              {/* Avaliação e vagas */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                  flex: 1,
                  backgroundColor: 'var(--secondary)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.3rem',
                    fontSize: '1.3rem',
                    fontWeight: '800',
                    color: 'var(--text)'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary)" stroke="var(--primary)" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    {casaSelecionada.avaliacao}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, color: 'var(--text)' }}>Avaliação</div>
                </div>

                <div style={{
                  flex: 1,
                  backgroundColor: 'var(--secondary)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.3rem',
                    fontWeight: '800',
                    color: casaSelecionada.vagas > 0 ? 'var(--primary)' : 'var(--text)'
                  }}>
                    {casaSelecionada.vagas}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.6, color: 'var(--text)' }}>
                    {casaSelecionada.vagas > 0 ? 'Vagas disponíveis' : 'Sem vagas'}
                  </div>
                </div>
              </div>

              {/* Serviços */}
              <div>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--text)',
                  opacity: 0.6,
                  marginBottom: '0.5rem'
                }}>
                  Serviços oferecidos
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {casaSelecionada.servicos.map(s => (
                    <span key={s} style={{
                      backgroundColor: 'var(--secondary)',
                      color: 'var(--text)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '100px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <button
                  onClick={() => setModalCasa(casaSelecionada)}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: 'none',
                    width: '100%',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Agendar Visita
                </button>
                <button
                  onClick={() => setCasaSelecionada(null)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--text)',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    width: '100%',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    border: '2px solid var(--secondary)',
                    cursor: 'pointer'
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Legenda */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginTop: '1.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {[
            { cor: '#80a6c6', label: 'Idosos' },
            { cor: '#e8a87c', label: 'Dependência química' },
            { cor: '#9b8fc4', label: 'Saúde mental' },
            { cor: '#7ab894', label: 'Vulnerabilidade social' },
            { cor: '#d1c2b3', label: 'Sem vagas' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '14px', height: '14px', borderRadius: '50%',
                backgroundColor: item.cor, border: '2px solid white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.7 }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de agendamento */}
      {modalCasa && (
        <ModalAgendamento
          casa={modalCasa}
          onFechar={() => setModalCasa(null)}
        />
      )}
    </section>
  )
}