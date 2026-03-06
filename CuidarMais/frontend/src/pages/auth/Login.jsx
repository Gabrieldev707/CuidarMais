import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    setErro('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.usuario, data.token)
      navigate('/dashboard')
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
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
      <div style={{
        width: '100%',
        maxWidth: '440px'
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Link to="/" style={{
            fontSize: '1.6rem',
            fontWeight: '700',
            color: 'var(--primary)',
            textDecoration: 'none'
          }}>
            Cuidar<span style={{ color: 'var(--text)' }}>Mais</span>
          </Link>
          <p style={{
            marginTop: '0.5rem',
            color: 'var(--text)',
            opacity: 0.6,
            fontSize: '0.95rem'
          }}>
            Entre na sua conta
          </p>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: 'var(--secondary)',
          borderRadius: '20px',
          padding: '2.5rem'
        }}>

          {/* Erro */}
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

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: '0.5rem'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '2px solid transparent',
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.border = '2px solid var(--primary)'}
              onBlur={e => e.target.style.border = '2px solid transparent'}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: 'var(--text)',
              marginBottom: '0.5rem'
            }}>
              Senha
            </label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '2px solid transparent',
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={e => e.target.style.border = '2px solid var(--primary)'}
              onBlur={e => e.target.style.border = '2px solid transparent'}
            />
          </div>

          {/* Botão */}
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
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.9rem',
            color: 'var(--text)',
            opacity: 0.7
          }}>
            Não tem conta?{' '}
            <Link to="/cadastro" style={{
              color: 'var(--primary)',
              fontWeight: '600',
              textDecoration: 'none'
            }}>
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}