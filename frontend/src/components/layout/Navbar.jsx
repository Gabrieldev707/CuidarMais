import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../../assets/logo.svg' // ✅ IMPORT DIRETO

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme()
  const { usuario, logout } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <nav style={{
      backgroundColor: 'var(--background)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
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

        {/* LOGO */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          textDecoration: 'none'
        }}>
          
          <img 
            src={Logo}
            alt="CuidarMais"
            style={{ 
              width: '34px',
              height: '34px',
              objectFit: 'contain'
            }}
          />

          <span style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            <span style={{ color: 'var(--accent)' }}>Cuidar</span>
            <span style={{ color: 'var(--success)' }}>Mais</span>
          </span>
        </Link>

        {/* MENU */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <Link to="/#como-funciona" style={{
            color: 'var(--primary-dark)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            Como Funciona
          </Link>

          <Link to="/#mapa" style={{
            color: 'var(--primary-dark)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            Mapa
          </Link>

          <Link to="/#casas" style={{
            color: 'var(--primary-dark)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            Casas
          </Link>

          <Link to="/#sobre" style={{
            color: 'var(--primary-dark)',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: '500'
          }}>
            Sobre
          </Link>
        </div>

        {/* DIREITA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

          {/* DARK MODE */}
          <button
            onClick={toggleDarkMode}
            style={{
              background: 'var(--primary)',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          {usuario ? (
            <>
              <Link to="/dashboard" style={{
                color: 'var(--primary-dark)',
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
                  cursor: 'pointer'
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: 'var(--primary-dark)',
                textDecoration: 'none',
                fontSize: '0.95rem',
                fontWeight: '500'
              }}>
                Entrar
              </Link>

              <Link to="/cadastro" style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                padding: '0.5rem 1.4rem',
                borderRadius: '20px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}