import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme()
  const { usuario, logout } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <nav style={{
      backgroundColor: 'var(--background)',
      borderBottom: '1px solid var(--secondary)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>

        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none'
        }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="var(--primary)" />
            <path d="M16 8C13.2 8 11 10.2 11 13C11 17 16 24 16 24C16 24 21 17 21 13C21 10.2 18.8 8 16 8ZM16 15C14.9 15 14 14.1 14 13C14 11.9 14.9 11 16 11C17.1 11 18 11.9 18 13C18 14.1 17.1 15 16 15Z" fill="white"/>
          </svg>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            color: 'var(--primary)',
            letterSpacing: '-0.5px'
          }}>
            Cuidar<span style={{ color: 'var(--text)' }}>Mais</span>
          </span>
        </Link>

        {/* Menu central */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }} className="desktop-menu">
          <Link to="/#como-funciona" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}>
            Como Funciona
          </Link>
          <Link to="/#casas" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
            opacity: 0.8
          }}>
            Casas
          </Link>
          <Link to="/#mapa" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
            opacity: 0.8
          }}>
            Mapa
          </Link>
          <Link to="/#sobre" style={{
            color: 'var(--text)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500',
            opacity: 0.8
          }}>
            Sobre
          </Link>
        </div>

        {/* Direita — dark mode + auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

          {/* Toggle dark mode */}
          <button
            onClick={toggleDarkMode}
            style={{
              background: 'var(--secondary)',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/dashboard" style={{
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                Olá, {usuario.nome.split(' ')[0]}
              </Link>
              <button
                onClick={logout}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '0.4rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Sair
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" style={{
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '500',
                opacity: 0.8
              }}>
                Entrar
              </Link>
              <Link to="/cadastro" style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '0.5rem 1.2rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'opacity 0.2s'
              }}>
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}