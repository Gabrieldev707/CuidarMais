import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'var(--background)',
      padding: '0 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Círculo decorativo fundo */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        opacity: 0.15,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-80px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary)',
        opacity: 0.1,
        pointerEvents: 'none'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center'
      }}>

        {/* Texto */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--accent)',
            color: 'var(--text)',
            padding: '0.4rem 1rem',
            borderRadius: '100px',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            opacity: 0.9
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            Cuidado com dignidade
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            lineHeight: '1.1',
            color: 'var(--text)',
            marginBottom: '1.5rem',
            letterSpacing: '-1px'
          }}>
            Encontre o lar ideal para quem você
            <span style={{ color: 'var(--primary)' }}> ama</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text)',
            opacity: 0.7,
            lineHeight: '1.7',
            marginBottom: '2.5rem',
            maxWidth: '480px'
          }}>
            O CuidarMais conecta famílias às melhores casas de apoio para idosos em Campina Grande. Transparência, segurança e acolhimento em um só lugar.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/mapa" style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              padding: '0.9rem 2rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.2s'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Buscar Casas
            </Link>

            <Link to="/cadastro" style={{
              backgroundColor: 'transparent',
              color: 'var(--text)',
              padding: '0.9rem 2rem',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '600',
              border: '2px solid var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Cadastrar minha casa
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: '2.5rem',
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--secondary)'
          }}>
            {[
              { numero: '47', label: 'Casas cadastradas' },
              { numero: '1.2k', label: 'Famílias atendidas' },
              { numero: '4.8', label: 'Avaliação média' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  lineHeight: 1
                }}>
                  {stat.numero}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text)',
                  opacity: 0.6,
                  marginTop: '0.25rem'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card visual direita */}
        <div style={{ position: 'relative' }}>
          <div style={{
            backgroundColor: 'var(--secondary)',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}>
            {/* Mini mapa placeholder */}
            <div style={{
              backgroundColor: 'var(--accent)',
              borderRadius: '16px',
              height: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" y1="3" x2="9" y2="18"/>
                <line x1="15" y1="6" x2="15" y2="21"/>
              </svg>
              <span style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.8rem',
                color: 'var(--text)',
                opacity: 0.6
              }}>
                Campina Grande, PB
              </span>

              {/* Pins simulados */}
              {[
                { top: '30%', left: '40%' },
                { top: '50%', left: '60%' },
                { top: '45%', left: '30%' },
              ].map((pos, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  border: '2px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }} />
              ))}
            </div>

            {/* Card de casa */}
            <div style={{
              backgroundColor: 'var(--background)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text)' }}>
                  Casa Raio de Sol
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.6 }}>
                  Bodocongó · 8 vagas disponíveis
                </div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: 'var(--accent)',
                padding: '0.25rem 0.6rem',
                borderRadius: '100px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'var(--text)'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--primary)" stroke="var(--primary)" strokeWidth="1">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                4.8
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}