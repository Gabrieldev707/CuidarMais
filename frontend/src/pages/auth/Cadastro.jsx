import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function Cadastro() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    role: 'familia',
    codigoConvite: ''
  })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    setErro('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      login(data.usuario, data.token)
      navigate('/dashboard')
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '10px',
    border: '2px solid transparent',
    backgroundColor: 'var(--background)',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '0.5rem'
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{
            fontSize: '1.6rem',
            fontWeight: '700',
            color: 'var(--primary)',
            textDecoration: 'none'
          }}>
            <span style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            letterSpacing: '-0.5px'
          }}>
            <span style={{ color: 'var(--accent)' }}>Cuidar</span>
            <span style={{ color: 'var(--success)' }}>Mais</span>
          </span>
          </Link>
          <p style={{
            marginTop: '0.5rem',
            color: 'var(--text)',
            opacity: 0.6,
            fontSize: '0.95rem'
          }}>
            Crie sua conta gratuitamente
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--secondary)',
          borderRadius: '20px',
          padding: '2.5rem'
        }}>

          {erro && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              marginBottom: '1.5rem'
            }}>
              {erro}
            </div>
          )}

          {/* Tipo de conta */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Tipo de conta</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                {
                  value: 'familia',
                  label: 'Família',
                  desc: 'Busco uma casa para meu familiar',
                  icone: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  )
                },
                {
                  value: 'gestor',
                  label: 'Gestor',
                  desc: 'Gerencio uma casa de apoio',
                  icone: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  )
                }
              ].map(tipo => (
                <div
                  key={tipo.value}
                  onClick={() => setForm(prev => ({ ...prev, role: tipo.value, codigoConvite: '' }))}
                  style={{
                    backgroundColor: form.role === tipo.value ? 'var(--primary)' : 'var(--background)',
                    color: form.role === tipo.value ? 'white' : 'var(--text)',
                    padding: '1rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '2px solid',
                    borderColor: form.role === tipo.value ? 'var(--primary)' : 'transparent'
                  }}
                >
                  <div style={{ marginBottom: '0.4rem' }}>{tipo.icone}</div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{tipo.label}</div>
                  <div style={{
                    fontSize: '0.78rem',
                    opacity: 0.75,
                    marginTop: '0.2rem',
                    lineHeight: '1.4'
                  }}>
                    {tipo.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Nome completo</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              style={inputStyle}
              onFocus={e => e.target.style.border = '2px solid var(--primary)'}
              onBlur={e => e.target.style.border = '2px solid transparent'}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              style={inputStyle}
              onFocus={e => e.target.style.border = '2px solid var(--primary)'}
              onBlur={e => e.target.style.border = '2px solid transparent'}
            />
          </div>

          {/* Telefone */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Telefone</label>
            <input
              type="text"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(83) 99999-9999"
              style={inputStyle}
              onFocus={e => e.target.style.border = '2px solid var(--primary)'}
              onBlur={e => e.target.style.border = '2px solid transparent'}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: form.role === 'gestor' ? '1.25rem' : '1.75rem' }}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              style={inputStyle}
              onFocus={e => e.target.style.border = '2px solid var(--primary)'}
              onBlur={e => e.target.style.border = '2px solid transparent'}
            />
          </div>

          {/* Código de convite — só aparece para gestor */}
          {form.role === 'gestor' && (
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={labelStyle}>
                Código de convite
                <span style={{
                  marginLeft: '0.4rem',
                  fontSize: '0.78rem',
                  fontWeight: '400',
                  opacity: 0.6
                }}>
                  (enviado por email pelo administrador)
                </span>
              </label>
              <input
                type="text"
                name="codigoConvite"
                value={form.codigoConvite}
                onChange={handleChange}
                placeholder="Ex: A1B2C3D4"
                maxLength={8}
                style={{
                  ...inputStyle,
                  letterSpacing: '4px',
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  textTransform: 'uppercase',
                  textAlign: 'center'
                }}
                onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                onBlur={e => e.target.style.border = '2px solid transparent'}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text)',
                opacity: 0.55
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Solicite o código ao administrador da plataforma
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.9rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.9rem',
            color: 'var(--text)',
            opacity: 0.7
          }}>
            Já tem conta?{' '}
            <Link to="/login" style={{
              color: 'var(--primary)',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}