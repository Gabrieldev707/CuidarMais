import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../../assets/logo.svg'

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme()
  const { usuario, logout } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  const linkStyle = {
    color: 'var(--text)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: '500',
    opacity: 0.8
  }

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
      {/* ─── Barra principal ─── */}
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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <img src={Logo} alt="CuidarMais" style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
            <span style={{ color: 'var(--accent)' }}>Cuidar</span>
            <span style={{ color: 'var(--success)' }}>Mais</span>
          </span>
        </Link>

        {/* LINKS — desktop */}
        <div className="nav-links-desktop">
          <Link to="/#como-funciona" style={linkStyle}>Como Funciona</Link>
          <Link to="/#mapa" style={linkStyle}>Mapa</Link>
          <Link to="/#casas" style={linkStyle}>Casas</Link>
          <Link to="/#sobre" style={linkStyle}>Sobre</Link>
        </div>

        {/* AÇÕES — desktop */}
        <div className="nav-actions-desktop">
          <button onClick={toggleDarkMode} style={{
            background: 'var(--primary)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3" stroke="white" strokeWidth="2"/>
                <line x1="12" y1="21" x2="12" y2="23" stroke="white" strokeWidth="2"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="white" strokeWidth="2"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="white" strokeWidth="2"/>
                <line x1="1" y1="12" x2="3" y2="12" stroke="white" strokeWidth="2"/>
                <line x1="21" y1="12" x2="23" y2="12" stroke="white" strokeWidth="2"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="white" strokeWidth="2"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="white" strokeWidth="2"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {usuario ? (
            <>
              <Link to="/dashboard" style={linkStyle}>Olá, {usuario.nome.split(' ')[0]}</Link>
              <button onClick={logout} style={{
                background: 'transparent',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                padding: '0.4rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle}>Entrar</Link>
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

        {/* HAMBURGER — mobile */}
        <button className="nav-hamburger" onClick={() => setMenuAberto(prev => !prev)}>
          {menuAberto ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      {/* ─── Menu mobile ─── */}
      <div className={`nav-mobile-menu ${menuAberto ? 'open' : ''}`}>
        <Link to="/#como-funciona" style={linkStyle} onClick={() => setMenuAberto(false)}>Como Funciona</Link>
        <Link to="/#mapa" style={linkStyle} onClick={() => setMenuAberto(false)}>Mapa</Link>
        <Link to="/#casas" style={linkStyle} onClick={() => setMenuAberto(false)}>Casas</Link>
        <Link to="/#sobre" style={linkStyle} onClick={() => setMenuAberto(false)}>Sobre</Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(128,128,128,0.15)', flexWrap: 'wrap' }}>
          <button onClick={() => { toggleDarkMode(); setMenuAberto(false) }} style={{
            background: 'var(--primary)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          {usuario ? (
            <>
              <Link to="/dashboard" style={linkStyle} onClick={() => setMenuAberto(false)}>Olá, {usuario.nome.split(' ')[0]}</Link>
              <button onClick={() => { logout(); setMenuAberto(false) }} style={{
                background: 'transparent', border: '1px solid var(--primary)',
                color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem'
              }}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle} onClick={() => setMenuAberto(false)}>Entrar</Link>
              <Link to="/cadastro" onClick={() => setMenuAberto(false)} style={{
                backgroundColor: 'var(--primary)', color: 'white',
                padding: '0.5rem 1.4rem', borderRadius: '20px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600'
              }}>Cadastrar</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
