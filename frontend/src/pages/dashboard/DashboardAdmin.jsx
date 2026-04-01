import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

export default function DashboardAdmin() {
  const { usuario } = useAuth()
  const [aba, setAba] = useState('visao')
  const [convites, setConvites] = useState([])
  const [stats, setStats] = useState({ usuarios: 0, gestores: 0, casas: 0, visitas: 0 })
  const [loading, setLoading] = useState(true)
  const [emailConvite, setEmailConvite] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [toastTipo, setToastTipo] = useState('sucesso')

  const toast = (msg, tipo = 'sucesso') => {
    setToastMsg(msg)
    setToastTipo(tipo)
    setTimeout(() => setToastMsg(''), 4000)
  }

  useEffect(() => { carregarDados() }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const [convitesRes, statsRes] = await Promise.all([
        api.get('/admin/convites'),
        api.get('/admin/stats').catch(() => ({ data: { stats: {} } }))
      ])
      setConvites(convitesRes.data.convites || [])
      if (statsRes.data.stats) setStats(statsRes.data.stats)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const gerarConvite = async () => {
    if (!emailConvite || !emailConvite.includes('@')) {
      toast('Digite um email válido', 'erro')
      return
    }
    setEnviando(true)
    try {
      await api.post('/admin/convite', { email: emailConvite })
      toast(`Convite enviado para ${emailConvite}!`)
      setEmailConvite('')
      carregarDados()
    } catch (err) {
      toast(err.response?.data?.message || 'Erro ao enviar convite', 'erro')
    } finally {
      setEnviando(false)
    }
  }

  const deletarConvite = async (id) => {
    if (!confirm('Tem certeza que quer remover este convite?')) return
    try {
      await api.delete(`/admin/convite/${id}`)
      toast('Convite removido!')
      carregarDados()
    } catch {
      toast('Erro ao remover convite', 'erro')
    }
  }

  const statusConvite = (convite) => {
    if (convite.usado) return { label: 'Usado', cor: '#7ab894' }
    if (new Date(convite.expiresAt) < new Date()) return { label: 'Expirado', cor: '#e87c7c' }
    return { label: 'Pendente', cor: '#e8a87c' }
  }

  const abas = [
    { key: 'visao', label: 'Visão geral', icon: <IconGrid /> },
    { key: 'convites', label: 'Convites', icon: <IconMail /> },
  ]

  const s = {
    input: {
      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
      border: '2px solid transparent', backgroundColor: 'var(--background)',
      color: 'var(--text)', fontSize: '0.9rem', outline: 'none',
      boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border 0.2s'
    },
    card: { backgroundColor: 'var(--secondary)', borderRadius: '20px', padding: '1.75rem' }
  }

  const BotaoEnviar = () => (
    <button onClick={gerarConvite} disabled={enviando} style={{
      backgroundColor: 'var(--primary)', color: 'white', border: 'none',
      padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.9rem',
      fontWeight: '700', cursor: enviando ? 'not-allowed' : 'pointer',
      opacity: enviando ? 0.7 : 1, whiteSpace: 'nowrap',
      display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.2s'
    }}>
      {enviando ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Enviando...
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Enviar convite
        </>
      )}
    </button>
  )

  const CardConvite = ({ c }) => {
    const st = statusConvite(c)
    return (
      <div style={{
        backgroundColor: 'var(--background)', borderRadius: '14px',
        padding: '1rem 1.25rem', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            backgroundColor: st.cor + '20', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: st.cor, flexShrink: 0
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
              {c.email}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.5, display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span>Criado em {new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
              <span>·</span>
              <span>Expira {new Date(c.expiresAt).toLocaleDateString('pt-BR')}</span>
              {c.criadoPor && <><span>·</span><span>por {c.criadoPor.nome}</span></>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontFamily: 'monospace', fontSize: '1rem', fontWeight: '700',
            letterSpacing: '3px', color: 'var(--text)', opacity: 0.5
          }}>
            {c.codigo}
          </span>
          <div style={{
            backgroundColor: st.cor + '20', color: st.cor,
            padding: '0.3rem 0.85rem', borderRadius: '100px',
            fontSize: '0.78rem', fontWeight: '700'
          }}>
            {st.label}
          </div>
          <button
            onClick={() => deletarConvite(c._id)}
            title="Remover convite"
            style={{
              backgroundColor: '#e87c7c20', color: '#e87c7c',
              border: 'none', width: '34px', height: '34px',
              borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s', flexShrink: 0
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e87c7c40'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#e87c7c20'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '2rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Toast */}
        {toastMsg && (
          <div style={{
            position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999,
            backgroundColor: toastTipo === 'sucesso' ? '#7ab894' : '#e87c7c',
            color: 'white', padding: '0.85rem 1.5rem', borderRadius: '14px',
            fontWeight: '600', fontSize: '0.9rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            animation: 'slideIn 0.3s ease'
          }}>
            {toastTipo === 'sucesso'
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            }
            {toastMsg}
          </div>
        )}

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                backgroundColor: 'var(--primary)', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text)' }}>
                Painel Admin
              </h1>
            </div>
            <p style={{ color: 'var(--text)', opacity: 0.6, fontSize: '0.95rem', paddingLeft: '0.25rem' }}>
              Olá, {usuario?.nome?.split(' ')[0]} — controle total do sistema
            </p>
          </div>

          <div style={{
            display: 'flex', backgroundColor: 'var(--secondary)',
            borderRadius: '12px', padding: '0.3rem', gap: '0.25rem'
          }}>
            {abas.map(a => (
              <button key={a.key} onClick={() => setAba(a.key)} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.55rem 1rem', borderRadius: '9px', border: 'none',
                cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600',
                backgroundColor: aba === a.key ? 'var(--background)' : 'transparent',
                color: aba === a.key ? 'var(--primary)' : 'var(--text)',
                boxShadow: aba === a.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}>
                {a.icon}{a.label}
              </button>
            ))}
          </div>
        </div>

        {/* ABA VISÃO GERAL */}
        {aba === 'visao' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                { label: 'Usuários', valor: stats.usuarios || '—', cor: '#80a6c6', icon: <IconUsers /> },
                { label: 'Gestores', valor: stats.gestores || '—', cor: '#9b8fc4', icon: <IconShield /> },
                { label: 'Casas', valor: stats.casas || '—', cor: '#7ab894', icon: <IconHome /> },
                { label: 'Visitas', valor: stats.visitas || '—', cor: '#e8a87c', icon: <IconCalendar /> },
              ].map(stat => (
                <div key={stat.label} style={{
                  ...s.card, borderLeft: `4px solid ${stat.cor}`,
                  display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    backgroundColor: stat.cor + '20', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: stat.cor
                  }}>
                    {stat.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: stat.cor, lineHeight: 1 }}>
                      {stat.valor}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.6 }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.3rem' }}>
                Convidar novo gestor
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.55, marginBottom: '1.25rem' }}>
                O gestor receberá um email com o código de acesso para criar sua conta
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <input type="email" value={emailConvite} onChange={e => setEmailConvite(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && gerarConvite()}
                    placeholder="email@gestor.com" style={s.input}
                    onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                    onBlur={e => e.target.style.border = '2px solid transparent'} />
                </div>
                <BotaoEnviar />
              </div>
            </div>

            <div style={s.card}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)', marginBottom: '1.25rem' }}>
                Últimos convites
              </h2>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text)', opacity: 0.4 }}>Carregando...</div>
              ) : convites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text)', opacity: 0.4 }}>Nenhum convite gerado ainda</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {convites.slice(0, 5).map(c => <CardConvite key={c._id} c={c} />)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA CONVITES */}
        {aba === 'convites' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={s.card}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.3rem' }}>
                Gerar novo convite
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.55, marginBottom: '1.25rem' }}>
                O gestor receberá um email com código válido por 48 horas
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <input type="email" value={emailConvite} onChange={e => setEmailConvite(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && gerarConvite()}
                    placeholder="email@gestor.com" style={s.input}
                    onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                    onBlur={e => e.target.style.border = '2px solid transparent'} />
                </div>
                <BotaoEnviar />
              </div>
            </div>

            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text)' }}>
                  Todos os convites ({convites.length})
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { label: `${convites.length} total` },
                    { label: `${convites.filter(c => !c.usado && new Date(c.expiresAt) > new Date()).length} pendentes` },
                    { label: `${convites.filter(c => c.usado).length} usados` },
                    { label: `${convites.filter(c => !c.usado && new Date(c.expiresAt) < new Date()).length} expirados` },
                  ].map(f => (
                    <span key={f.label} style={{
                      padding: '0.25rem 0.7rem', borderRadius: '100px',
                      fontSize: '0.75rem', fontWeight: '600',
                      backgroundColor: 'var(--background)', color: 'var(--text)', opacity: 0.6
                    }}>
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text)', opacity: 0.4 }}>Carregando...</div>
              ) : convites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    backgroundColor: 'var(--background)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', opacity: 0.3, color: 'var(--text)'
                  }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <p style={{ color: 'var(--text)', opacity: 0.4, fontSize: '0.9rem' }}>Nenhum convite gerado</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {convites.map(c => <CardConvite key={c._id} c={c} />)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  )
}

function IconGrid() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
}
function IconMail() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
}
function IconUsers() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
}
function IconShield() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
}
function IconHome() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
}
function IconCalendar() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
}