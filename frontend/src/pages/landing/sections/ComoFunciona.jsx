export default function ComoFunciona() {
  const passos = [
    {
      numero: '01',
      titulo: 'Busque no mapa',
      descricao: 'Encontre casas de apoio próximas a você em Campina Grande. Filtre por serviços, vagas e avaliações.',
      icone: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      )
    },
    {
      numero: '02',
      titulo: 'Conheça a casa',
      descricao: 'Veja fotos, serviços oferecidos, avaliações de outras famílias e agende uma visita presencial.',
      icone: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      numero: '03',
      titulo: 'Agende uma visita',
      descricao: 'Marque uma visita diretamente pela plataforma. O gestor confirma e você conhece o espaço pessoalmente.',
      icone: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      )
    },
    {
      numero: '04',
      titulo: 'Acolhimento garantido',
      descricao: 'Após a visita, finalize o processo com segurança. Avalie a experiência e ajude outras famílias.',
      icone: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      )
    }
  ]

  return (
    <section id="como-funciona" style={{
      padding: '6rem 2rem',
      backgroundColor: 'var(--primary-dark)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: 'var(--accent)',
            color: 'var(--text)',
            padding: '0.4rem 1rem',
            borderRadius: '100px',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '1rem',
            opacity: 0.9
          }}>
            Simples e rápido
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--text-light)',
            letterSpacing: '-0.5px',
            marginBottom: '1rem'
          }}>
            Como funciona o CuidarMais
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-light)',
            opacity: 0.6,
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Em poucos passos você encontra o lugar certo para quem você ama
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem'
        }}>
          {passos.map((passo, index) => (
            <div key={passo.numero} style={{
              backgroundColor: 'var(--secondary)',
              borderRadius: '20px',
              padding: '2rem',
              position: 'relative',
              transition: 'transform 0.2s',
              cursor: 'default'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Número */}
              <div style={{
                fontSize: '3rem',
                fontWeight: '900',
                color: 'var(--primary)',
                opacity: 0.2,
                position: 'absolute',
                top: '1rem',
                right: '1.5rem',
                lineHeight: 1
              }}>
                {passo.numero}
              </div>

              {/* Ícone */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                marginBottom: '1.5rem'
              }}>
                {passo.icone}
              </div>

              <h3 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: 'var(--text)',
                marginBottom: '0.75rem'
              }}>
                {passo.titulo}
              </h3>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text)',
                opacity: 0.65,
                lineHeight: '1.6'
              }}>
                {passo.descricao}
              </p>

              {/* Seta conectora */}
              {index < passos.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: '-1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  color: 'var(--background)',
                  opacity: 0.4
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}