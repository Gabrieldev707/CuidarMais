import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section style={{
      padding: '6rem 2rem',
      backgroundColor: 'var(--background)' // branco
    }}>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2.8rem',
          fontWeight: '800',
          color: 'var(--text)', // 🔥 destaque
          letterSpacing: '-0.5px',
          marginBottom: '1.25rem',
          lineHeight: '1.2'
        }}>
          Comece a cuidar de quem você ama hoje
        </h2>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text)',
          opacity: 0.6,
          lineHeight: '1.7',
          marginBottom: '2.5rem'
        }}>
          Cadastre-se gratuitamente e encontre a casa de apoio ideal para o seu familiar em Campina Grande.
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          
          {/* BOTÃO PRINCIPAL */}
          <Link to="/cadastro" style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--text-light)', // branco
            padding: '0.9rem 2.2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '700'
          }}>
            Criar conta grátis
          </Link>

          {/* BOTÃO SECUNDÁRIO */}
          <Link to="#mapa" style={{
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            padding: '0.9rem 2.2rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            border: '2px solid var(--primary)'
          }}>
            Explorar o mapa
          </Link>

        </div>
      </div>
    </section>
  )
}