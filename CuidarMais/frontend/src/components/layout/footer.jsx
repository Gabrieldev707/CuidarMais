import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--background)',
      borderTop: '1px solid var(--secondary)',
      padding: '3rem 2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '3rem'
      }}>
        {/* Logo e descrição */}
        <div>
          <div style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: 'var(--primary)',
            marginBottom: '0.75rem'
          }}>
            Cuidar<span style={{ color: 'var(--text)' }}>Mais</span>
          </div>
          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text)',
            opacity: 0.6,
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
              color: 'var(--text)',
              opacity: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '1rem'
            }}>
              {col.titulo}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {col.links.map(link => (
                <Link key={link.label} to={link.href} style={{
                  color: 'var(--text)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  opacity: 0.7,
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
        borderTop: '1px solid var(--secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.5 }}>
          © 2024 CuidarMais — Projeto Universitário
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.5 }}>
          Campina Grande, PB
        </span>
      </div>
    </footer>
  )
}