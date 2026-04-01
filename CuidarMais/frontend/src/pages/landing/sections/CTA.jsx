import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section style={{
      padding: '6rem 2rem',
      backgroundColor: 'var(--primary)'
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2.8rem',
          fontWeight: '800',
          color: 'white',
          letterSpacing: '-0.5px',
          marginBottom: '1.25rem',
          lineHeight: '1.2'
        }}>
          Comece a cuidar de quem você ama hoje
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: 'white',
          opacity: 0.8,
          lineHeight: '1.7',
          marginBottom: '2.5rem'
        }}>
          Cadastre-se gratuitamente e encontre a casa de apoio ideal para o seu familiar em Campina Grande.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/cadastro" style={{
            backgroundColor: 'white',
            color: 'var(--primary)',
            padding: '0.9rem 2.2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '700',
            transition: 'opacity 0.2s'
          }}>
            Criar conta grátis
          </Link>
          <Link to="#mapa" style={{
            backgroundColor: 'transparent',
            color: 'white',
            padding: '0.9rem 2.2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            border: '2px solid rgba(255,255,255,0.4)'
          }}>
            Explorar o mapa
          </Link>
        </div>
      </div>
    </section>
  )
}