const casas = [
  {
    id: 1,
    nome: 'Casa Raio de Sol',
    bairro: 'Bodocongó',
    vagas: 8,
    avaliacao: 4.8,
    totalAvaliacoes: 24,
    servicos: ['Enfermagem', 'Fisioterapia', 'Alimentação'],
    cor: 'var(--primary)'
  },
  {
    id: 2,
    nome: 'Lar Esperança',
    bairro: 'Mirante',
    vagas: 3,
    avaliacao: 4.6,
    totalAvaliacoes: 18,
    servicos: ['Enfermagem', 'Medicamentos', 'Psicologia'],
    cor: 'var(--primary)'
  },
  {
    id: 3,
    nome: 'Casa Bem Viver',
    bairro: 'Centro',
    vagas: 0,
    avaliacao: 4.9,
    totalAvaliacoes: 31,
    servicos: ['Fisioterapia', 'Alimentação', 'Transporte'],
    cor: 'var(--primary)'
  }
]

export default function CasasDestaque() {
  return (
    <section id="casas" style={{
      padding: '6rem 2rem',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
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
              Em destaque
            </div>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: 'var(--text)',
              letterSpacing: '-0.5px'
            }}>
              Casas mais bem avaliadas
            </h2>
          </div>
          <a href="#mapa" style={{
            color: 'var(--primary)',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            Ver todas no mapa
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem'
        }}>
          {casas.map(casa => (
            <div key={casa.id} style={{
              backgroundColor: 'var(--secondary)',
              borderRadius: '20px',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Foto placeholder */}
              <div style={{
                height: '160px',
                backgroundColor: casa.cor,
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>

                {/* Badge vagas */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: casa.vagas > 0 ? 'white' : '#f2e2cf',
                  color: casa.vagas > 0 ? 'var(--primary)' : 'var(--text)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '100px',
                  fontSize: '0.78rem',
                  fontWeight: '700'
                }}>
                  {casa.vagas > 0 ? `${casa.vagas} vagas` : 'Sem vagas'}
                </div>
              </div>

              {/* Conteúdo */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.75rem'
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '1.05rem',
                      fontWeight: '700',
                      color: 'var(--text)',
                      marginBottom: '0.25rem'
                    }}>
                      {casa.nome}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.85rem',
                      color: 'var(--text)',
                      opacity: 0.6
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {casa.bairro}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    backgroundColor: 'var(--background)',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '8px'
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#80a6c6" stroke="#80a6c6" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text)' }}>
                      {casa.avaliacao}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text)', opacity: 0.5 }}>
                      ({casa.totalAvaliacoes})
                    </span>
                  </div>
                </div>

                {/* Serviços */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  {casa.servicos.map(s => (
                    <span key={s} style={{
                      backgroundColor: 'var(--background)',
                      color: 'var(--text)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      opacity: 0.8
                    }}>
                      {s}
                    </span>
                  ))}
                </div>

                <button style={{
                  width: '100%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}