import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--primary-dark)',
      borderTop: '1px solid var(--primary-dark)',
      padding: '3rem 2rem'
    }}>
      <div className="footer-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Logo e descrição */}
        <div>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            marginBottom: '0.75rem'
          }}>
            <span style={{ color: 'var(--accent)' }}>Cuidar</span>
            <span style={{ color: 'var(--success)' }}>Mais</span>
          </div>

          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-light)',
            lineHeight: '1.6',
            maxWidth: '260px'
          }}>
            Conectando famílias às melhores casas de apoio para idosos em Campina Grande.
          </p>
        </div>

        {/* Links */}
        {[
          {
            titulo: 'Plataforma',
            links: [
              { label: 'Como Funciona', href: '#como-funciona' },
              { label: 'Buscar Casas', href: '#mapa' },
              { label: 'Cadastrar Casa', href: '/cadastro' },
            ]
          },
          {
            titulo: 'Conta',
            links: [
              { label: 'Criar conta', href: '/cadastro' },
              { label: 'Entrar', href: '/login' },
              { label: 'Dashboard', href: '/dashboard' },
            ]
          },
          {
            titulo: 'Sobre',
            links: [
              { label: 'O Projeto', href: '#sobre' },
              { label: 'Contato', href: '#' },
              { label: 'Universidade', href: '#' },
            ]
          }
        ].map(col => (
          <div key={col.titulo}>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              color: 'var(--text-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '1rem'
            }}>
              {col.titulo}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {col.links.map(link => (
                <Link key={link.label} to={link.href} style={{
                  color: 'var(--text-light)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'opacity 0.2s'
                }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto 0',
        paddingTop: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
          © 2026 CuidarMais — Projeto Universitário
        </span>

        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
          Campina Grande, PB
        </span>
      </div>
    </footer>
  )
}