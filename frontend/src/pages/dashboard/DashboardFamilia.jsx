import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ModalAgendamento from '../../components/ui/ModalAgendamento'
import api from '../../services/api'

const statusCandidaturaConfig = {
  pendente: { label: 'Pendente', cor: '#e8a87c', bg: '#e8a87c18' },
  em_analise: { label: 'Em análise', cor: '#80a6c6', bg: '#80a6c618' },
  aceita: { label: 'Aceita', cor: '#7ab894', bg: '#7ab89418' },
  recusada: { label: 'Recusada', cor: '#e87c7c', bg: '#e87c7c18' }
}

const statusVisitaConfig = {
  pendente: { label: 'Pendente', cor: '#e8a87c' },
  confirmada: { label: 'Confirmada', cor: '#7ab894' },
  cancelada: { label: 'Cancelada', cor: '#e87c7c' },
  realizada: { label: 'Realizada', cor: '#80a6c6' }
}

const cores = {
  idosos: '#80a6c6',
  dependentes_quimicos: '#e8a87c',
  saude_mental: '#9b8fc4',
  vulnerabilidade_social: '#7ab894'
}

const labelTipo = {
  idosos: 'Idosos',
  dependentes_quimicos: 'Dep. Químicos',
  saude_mental: 'Saúde Mental',
  vulnerabilidade_social: 'Vulnerabilidade Social'
}

const labelPerfil = {
  idoso: 'Idoso',
  dependente_quimico: 'Dep. Químico',
  saude_mental: 'Saúde Mental',
  vulnerabilidade_social: 'Vulnerabilidade Social'
}

// --- Ícones SVG ---
const IconHome = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconCalendar = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconUser = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconStar = ({ size = 16, color = 'currentColor', filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconX = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconSend = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
const IconChevronRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

// --- Modal Cadastro Assistido ---
function ModalAssistido({ onFechar, onSalvo }) {
  const [form, setForm] = useState({
    nome: '', dataNascimento: '', perfil: 'idoso',
    dependencia: 'parcial', condicoes: '',
    contatoEmergencia: { nome: '', telefone: '', parentesco: '' },
    observacoes: ''
  })
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async () => {
    setErro('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        condicoes: form.condicoes ? form.condicoes.split(',').map(c => c.trim()).filter(Boolean) : []
      }
      const { data } = await api.post('/assistidos', payload)
      onSalvo(data.assistido)
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  const input = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
    border: '2px solid transparent', backgroundColor: 'var(--background)',
    color: 'var(--text)', fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border 0.2s'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--secondary)', borderRadius: '20px',
        padding: '2rem', width: '100%', maxWidth: '520px',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text)' }}>Cadastrar assistido</h2>
          <button onClick={onFechar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', opacity: 0.5 }}>
            <IconX size={20} />
          </button>
        </div>

        {erro && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {erro}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>Nome completo</label>
            <input style={input} value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
              placeholder="Nome do assistido"
              onFocus={e => e.target.style.border = '2px solid var(--primary)'}
              onBlur={e => e.target.style.border = '2px solid transparent'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>Data de nascimento</label>
              <input type="date" style={input} value={form.dataNascimento}
                onChange={e => setForm(p => ({ ...p, dataNascimento: e.target.value }))}
                onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                onBlur={e => e.target.style.border = '2px solid transparent'} />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>Dependência</label>
              <select style={{ ...input, cursor: 'pointer' }} value={form.dependencia}
                onChange={e => setForm(p => ({ ...p, dependencia: e.target.value }))}>
                <option value="independente">Independente</option>
                <option value="parcial">Parcial</option>
                <option value="total">Total</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>Perfil</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {Object.entries(labelPerfil).map(([val, lbl]) => (
                <div key={val} onClick={() => setForm(p => ({ ...p, perfil: val }))}
                  style={{
                    padding: '0.65rem 0.75rem', borderRadius: '10px', cursor: 'pointer',
                    border: '2px solid', fontSize: '0.82rem', fontWeight: '600',
                    borderColor: form.perfil === val ? 'var(--primary)' : 'transparent',
                    backgroundColor: form.perfil === val ? 'var(--primary)' : 'var(--background)',
                    color: form.perfil === val ? 'white' : 'var(--text)', transition: 'all 0.15s'
                  }}>
                  {lbl}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>
              Condições <span style={{ fontWeight: '400' }}>(separe por vírgula)</span>
            </label>
            <input style={input} value={form.condicoes}
              onChange={e => setForm(p => ({ ...p, condicoes: e.target.value }))}
              placeholder="Ex: Diabetes, Hipertensão"
              onFocus={e => e.target.style.border = '2px solid var(--primary)'}
              onBlur={e => e.target.style.border = '2px solid transparent'} />
          </div>

          <div style={{ borderTop: '1px solid var(--background)', paddingTop: '1rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)', opacity: 0.6, display: 'block', marginBottom: '0.75rem' }}>Contato de emergência</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input style={input} placeholder="Nome do contato"
                value={form.contatoEmergencia.nome}
                onChange={e => setForm(p => ({ ...p, contatoEmergencia: { ...p.contatoEmergencia, nome: e.target.value } }))}
                onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                onBlur={e => e.target.style.border = '2px solid transparent'} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input style={input} placeholder="Telefone"
                  value={form.contatoEmergencia.telefone}
                  onChange={e => setForm(p => ({ ...p, contatoEmergencia: { ...p.contatoEmergencia, telefone: e.target.value } }))}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'} />
                <input style={input} placeholder="Parentesco"
                  value={form.contatoEmergencia.parentesco}
                  onChange={e => setForm(p => ({ ...p, contatoEmergencia: { ...p.contatoEmergencia, parentesco: e.target.value } }))}
                  onFocus={e => e.target.style.border = '2px solid var(--primary)'}
                  onBlur={e => e.target.style.border = '2px solid transparent'} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>Observações</label>
            <textarea style={{ ...input, minHeight: '80px', resize: 'vertical' }}
              value={form.observacoes}
              onChange={e => setForm(p => ({ ...p, observacoes: e.target.value }))}
              placeholder="Informações adicionais relevantes"
              onFocus={e => e.target.style.border = '2px solid var(--primary)'}
              onBlur={e => e.target.style.border = '2px solid transparent'} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: '100%', marginTop: '1.5rem',
          backgroundColor: 'var(--primary)', color: 'white',
          border: 'none', padding: '0.9rem', borderRadius: '12px',
          fontSize: '0.95rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'Cadastrando...' : 'Cadastrar assistido'}
        </button>
      </div>
    </div>
  )
}

// --- Modal Candidatura ---
function ModalCandidatura({ casa, assistido, onFechar, onEnviado }) {
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleEnviar = async () => {
    setErro('')
    setLoading(true)
    try {
      await api.post('/candidaturas', {
        assistidoId: assistido._id,
        casaId: casa._id,
        mensagem
      })
      onEnviado()
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao enviar candidatura')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--secondary)', borderRadius: '20px',
        padding: '2rem', width: '100%', maxWidth: '460px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text)' }}>Enviar candidatura</h2>
          <button onClick={onFechar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', opacity: 0.5 }}>
            <IconX size={20} />
          </button>
        </div>

        <div style={{ backgroundColor: 'var(--background)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: cores[casa.tipo], marginBottom: '0.25rem' }}>
            {labelTipo[casa.tipo]}
          </div>
          <div style={{ fontWeight: '700', color: 'var(--text)' }}>{casa.nome}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.6 }}>
            {casa.endereco?.bairro} · {casa.vagasDisponiveis} vagas
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--background)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text)', opacity: 0.5, marginBottom: '0.25rem' }}>ASSISTIDO</div>
          <div style={{ fontWeight: '700', color: 'var(--text)' }}>{assistido.nome}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.6 }}>{labelPerfil[assistido.perfil]}</div>
        </div>

        {erro && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {erro}
          </div>
        )}

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)', opacity: 0.6, display: 'block', marginBottom: '0.4rem' }}>
            Mensagem para o gestor <span style={{ fontWeight: '400' }}>(opcional)</span>
          </label>
          <textarea
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            placeholder="Apresente brevemente a situação do assistido..."
            style={{
              width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
              border: '2px solid transparent', backgroundColor: 'var(--background)',
              color: 'var(--text)', fontSize: '0.9rem', outline: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit', minHeight: '100px',
              resize: 'vertical', transition: 'border 0.2s'
            }}
            onFocus={e => e.target.style.border = '2px solid var(--primary)'}
            onBlur={e => e.target.style.border = '2px solid transparent'}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onFechar} style={{
            flex: 1, backgroundColor: 'var(--background)', color: 'var(--text)',
            border: 'none', padding: '0.85rem', borderRadius: '12px',
            fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'
          }}>
            Cancelar
          </button>
          <button onClick={handleEnviar} disabled={loading} style={{
            flex: 2, backgroundColor: 'var(--primary)', color: 'white',
            border: 'none', padding: '0.85rem', borderRadius: '12px',
            fontSize: '0.9rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
          }}>
            <IconSend size={15} /> {loading ? 'Enviando...' : 'Enviar candidatura'}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Modal Avaliação ---
function ModalAvaliacao({ visita, onFechar, onSalvo }) {
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEnviar = async () => {
    setLoading(true)
    try {
      await api.post('/avaliacoes', {
        casaId: visita.casaId._id || visita.casaId,
        visitaId: visita._id,
        nota,
        comentario
      })
      onSalvo()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--secondary)', borderRadius: '20px',
        padding: '2rem', width: '100%', maxWidth: '420px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text)' }}>Avaliar visita</h2>
          <button onClick={onFechar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', opacity: 0.5 }}>
            <IconX size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text)', opacity: 0.6, marginBottom: '1.5rem' }}>
          Como foi sua visita à <strong style={{ opacity: 1 }}>{visita.casaId?.nome || 'casa'}</strong>?
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setNota(n)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              transform: n <= nota ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.15s'
            }}>
              <IconStar size={36} color="#e8a87c" filled={n <= nota} />
            </button>
          ))}
        </div>

        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder="Compartilhe sua experiência..."
          style={{
            width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
            border: '2px solid transparent', backgroundColor: 'var(--background)',
            color: 'var(--text)', fontSize: '0.9rem', outline: 'none',
            boxSizing: 'border-box', fontFamily: 'inherit', minHeight: '80px',
            resize: 'vertical', marginBottom: '1.25rem', transition: 'border 0.2s'
          }}
          onFocus={e => e.target.style.border = '2px solid var(--primary)'}
          onBlur={e => e.target.style.border = '2px solid transparent'}
        />

        <button onClick={handleEnviar} disabled={loading} style={{
          width: '100%', backgroundColor: 'var(--primary)', color: 'white',
          border: 'none', padding: '0.9rem', borderRadius: '12px',
          fontSize: '0.95rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'Enviando...' : 'Enviar avaliação'}
        </button>
      </div>
    </div>
  )
}

// --- Dashboard Principal ---
export default function DashboardFamilia() {
  const { usuario } = useAuth()
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  const [aba, setAba] = useState('visao-geral') // 'visao-geral' | 'casas' | 'candidaturas' | 'visitas'
  const [assistido, setAssistido] = useState(null)
  const [casas, setCasas] = useState([])
  const [visitas, setVisitas] = useState([])
  const [candidaturas, setCandidaturas] = useState([])
  const [filtroTipo, setFiltroTipo] = useState('')
  const [casaSelecionada, setCasaSelecionada] = useState(null)

  const [modalAssistido, setModalAssistido] = useState(false)
  const [modalCandidatura, setModalCandidatura] = useState(null)
  const [modalVisita, setModalVisita] = useState(null)
  const [modalAvaliacao, setModalAvaliacao] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    setLoading(true)
    try {
      const [resAssistido, resCasas, resVisitas, resCandidaturas] = await Promise.all([
        api.get('/assistidos/meu'),
        api.get('/casas'),
        api.get('/visitas/minhas'),
        api.get('/candidaturas/minhas')
      ])
      setAssistido(resAssistido.data.assistido)
      setCasas(resCasas.data.casas || [])
      setVisitas(resVisitas.data.visitas || [])
      setCandidaturas(resCandidaturas.data.candidaturas || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Mapa
  useEffect(() => {
    if (aba !== 'visao-geral') return
    if (mapInstanceRef.current || !mapRef.current) return
    const L = window.L
    if (!L) return

    setTimeout(() => {
      const map = L.map(mapRef.current, {
        center: [-7.2306, -35.8811],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map)

      casas.forEach(casa => {
        if (!casa.endereco?.coords?.lat) return
        const corPin = casa.vagasDisponiveis > 0 ? (cores[casa.tipo] || '#80a6c6') : '#d1c2b3'
        const icone = L.divIcon({
          html: `<div style="background:${corPin};width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);"></div>`,
          className: '', iconSize: [28, 28], iconAnchor: [14, 28]
        })
        L.marker([casa.endereco.coords.lat, casa.endereco.coords.lng], { icon: icone })
          .addTo(map)
          .on('click', () => setCasaSelecionada(casa))
      })

      mapInstanceRef.current = map
    }, 100)
  }, [aba, casas])

  const casasFiltradas = filtroTipo ? casas.filter(c => c.tipo === filtroTipo) : casas
  const proximaVisita = visitas.find(v => v.status === 'confirmada' || v.status === 'pendente')
  const visitasRealizadas = visitas.filter(v => v.status === 'realizada')
  const casasUnicas = [...new Set(visitas.map(v => v.casaId?._id || v.casaId).filter(Boolean))]

  // Recomendação: casa com vagas, melhor avaliação, que bate com perfil do assistido
  const perfilParaTipo = {
    idoso: 'idosos',
    dependente_quimico: 'dependentes_quimicos',
    saude_mental: 'saude_mental',
    vulnerabilidade_social: 'vulnerabilidade_social'
  }
  const casasVisitadasIds = new Set(casasUnicas.map(id => id?.toString()))
  const casaRecomendada = casas
    .filter(c => c.vagasDisponiveis > 0 && !casasVisitadasIds.has(c._id?.toString()))
    .sort((a, b) => {
      const aMatch = assistido && perfilParaTipo[assistido.perfil] === a.tipo ? 1 : 0
      const bMatch = assistido && perfilParaTipo[assistido.perfil] === b.tipo ? 1 : 0
      if (bMatch !== aMatch) return bMatch - aMatch
      return (b.avaliacaoMedia || 0) - (a.avaliacaoMedia || 0)
    })[0] || null

  const btnAba = (id, label, icone) => (
    <button onClick={() => setAba(id)} style={{
      display: 'flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.6rem 1rem', borderRadius: '10px', border: 'none',
      backgroundColor: aba === id ? 'var(--primary)' : 'transparent',
      color: aba === id ? 'white' : 'var(--text)',
      fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
      opacity: aba === id ? 1 : 0.6, transition: 'all 0.2s'
    }}>
      {icone}{label}
    </button>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text)', opacity: 0.5, fontSize: '0.95rem' }}>Carregando...</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text)', marginBottom: '0.2rem' }}>
              Olá, {usuario.nome.split(' ')[0]}
            </h1>
            <p style={{ color: 'var(--text)', opacity: 0.55, fontSize: '0.9rem' }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          {/* Assistido card */}
          {assistido ? (
            <div style={{
              backgroundColor: 'var(--secondary)', borderRadius: '12px',
              padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: cores[assistido.perfil === 'idoso' ? 'idosos' : assistido.perfil] + '30',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <IconUser size={16} color={cores[assistido.perfil === 'idoso' ? 'idosos' : assistido.perfil] || 'var(--primary)'} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text)' }}>{assistido.nome}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text)', opacity: 0.5 }}>{labelPerfil[assistido.perfil]}</div>
              </div>
            </div>
          ) : (
            <button onClick={() => setModalAssistido(true)} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: 'var(--primary)', color: 'white',
              border: 'none', padding: '0.75rem 1.25rem', borderRadius: '12px',
              fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer'
            }}>
              <IconPlus size={15} /> Cadastrar assistido
            </button>
          )}
        </div>

        {/* Abas */}
        <div style={{
          display: 'flex', gap: '0.25rem', backgroundColor: 'var(--secondary)',
          padding: '0.35rem', borderRadius: '14px', marginBottom: '1.75rem',
          width: 'fit-content', flexWrap: 'wrap'
        }}>
          {btnAba('visao-geral', 'Visão geral', <IconHome size={15} />)}
          {btnAba('casas', 'Casas', <IconHome size={15} />)}
          {btnAba('candidaturas', 'Candidaturas', <IconSend size={15} />)}
          {btnAba('visitas', 'Visitas', <IconCalendar size={15} />)}
        </div>

        {/* ---- ABA: VISÃO GERAL ---- */}
        {aba === 'visao-geral' && (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Visitas agendadas', valor: visitas.filter(v => v.status === 'pendente' || v.status === 'confirmada').length, cor: '#80a6c6' },
                { label: 'Visitas realizadas', valor: visitasRealizadas.length, cor: '#7ab894' },
                { label: 'Casas visitadas', valor: casasUnicas.length, cor: '#9b8fc4' },
                { label: 'Candidaturas', valor: candidaturas.length, cor: '#e8a87c' }
              ].map(stat => (
                <div key={stat.label} style={{
                  backgroundColor: 'var(--secondary)', borderRadius: '16px', padding: '1.25rem'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: stat.cor, lineHeight: 1, marginBottom: '0.4rem' }}>
                    {stat.valor}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text)', opacity: 0.55 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Mapa + Sidebar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', marginBottom: '2rem', alignItems: 'start' }}>
              <div style={{ backgroundColor: 'var(--secondary)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.1rem' }}>Casas próximas</h2>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text)', opacity: 0.5 }}>Clique nos pins para ver detalhes</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {Object.entries(cores).slice(0, 3).map(([tipo, cor]) => (
                      <div key={tipo} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cor }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text)', opacity: 0.55 }}>{labelTipo[tipo].split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: '360px', position: 'relative' }}>
                  <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
                  {casaSelecionada && (
                    <div style={{
                      position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem',
                      backgroundColor: 'var(--background)', borderRadius: '14px', padding: '1rem',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)', zIndex: 1000,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'
                    }}>
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem' }}>{casaSelecionada.nome}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text)', opacity: 0.55 }}>
                          {casaSelecionada.endereco?.bairro} · {casaSelecionada.vagasDisponiveis > 0 ? `${casaSelecionada.vagasDisponiveis} vagas` : 'Sem vagas'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => setCasaSelecionada(null)} style={{
                          backgroundColor: 'var(--secondary)', border: 'none', borderRadius: '8px',
                          padding: '0.45rem 0.75rem', fontSize: '0.8rem', color: 'var(--text)', cursor: 'pointer', fontWeight: '600'
                        }}>Fechar</button>
                        {assistido && (
                          <button onClick={() => setModalCandidatura(casaSelecionada)} style={{
                            backgroundColor: 'var(--primary)', border: 'none', borderRadius: '8px',
                            padding: '0.45rem 0.75rem', fontSize: '0.8rem', color: 'white', cursor: 'pointer', fontWeight: '600'
                          }}>Candidatura</button>
                        )}
                        <button onClick={() => setModalVisita(casaSelecionada)} style={{
                          backgroundColor: 'var(--primary)', border: 'none', borderRadius: '8px',
                          padding: '0.45rem 0.75rem', fontSize: '0.8rem', color: 'white', cursor: 'pointer', fontWeight: '600'
                        }}>Agendar</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {proximaVisita && (
                  <div style={{ backgroundColor: 'var(--secondary)', borderRadius: '20px', padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text)', opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.875rem' }}>
                      Próxima visita
                    </div>
                    <div style={{ backgroundColor: 'var(--background)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusVisitaConfig[proximaVisita.status].cor }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: statusVisitaConfig[proximaVisita.status].cor }}>
                          {statusVisitaConfig[proximaVisita.status].label}
                        </span>
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        {proximaVisita.casaId?.nome || 'Casa'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.55 }}>
                        {new Date(proximaVisita.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                        {' · '}{proximaVisita.horario === 'manha' ? 'Manhã' : 'Tarde'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Candidatura mais recente */}
                {candidaturas.length > 0 && (
                  <div style={{ backgroundColor: 'var(--secondary)', borderRadius: '20px', padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text)', opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.875rem' }}>
                      Última candidatura
                    </div>
                    <div style={{ backgroundColor: 'var(--background)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                        {candidaturas[0].casaId?.nome || 'Casa'}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        backgroundColor: statusCandidaturaConfig[candidaturas[0].status].bg,
                        color: statusCandidaturaConfig[candidaturas[0].status].cor,
                        padding: '0.2rem 0.7rem', borderRadius: '100px',
                        fontSize: '0.75rem', fontWeight: '700', marginTop: '0.25rem'
                      }}>
                        {statusCandidaturaConfig[candidaturas[0].status].label}
                      </div>
                    </div>
                  </div>
                )}

                {/* Recomendada */}
                {casaRecomendada && (
                  <div style={{ backgroundColor: 'var(--secondary)', borderRadius: '20px', padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text)', opacity: 0.45, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.875rem' }}>
                      Recomendada para você
                    </div>
                    <div style={{ backgroundColor: 'var(--background)', borderRadius: '12px', overflow: 'hidden' }}>
                      <div style={{ height: '4px', backgroundColor: cores[casaRecomendada.tipo] || 'var(--primary)' }} />
                      <div style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: '700', color: cores[casaRecomendada.tipo], marginBottom: '0.2rem' }}>
                          {labelTipo[casaRecomendada.tipo]}
                        </div>
                        <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                          {casaRecomendada.nome}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text)', opacity: 0.55, marginBottom: '0.75rem' }}>
                          {casaRecomendada.endereco?.bairro}
                          {casaRecomendada.avaliacaoMedia > 0 && ` · ${casaRecomendada.avaliacaoMedia.toFixed(1)}`}
                          {` · ${casaRecomendada.vagasDisponiveis} vagas`}
                        </div>
                        {casaRecomendada.servicos?.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                            {casaRecomendada.servicos.slice(0, 2).map(s => (
                              <span key={s} style={{
                                backgroundColor: 'var(--secondary)', color: 'var(--text)',
                                padding: '0.15rem 0.5rem', borderRadius: '100px',
                                fontSize: '0.7rem', fontWeight: '500', opacity: 0.7
                              }}>{s.replace(/_/g, ' ')}</span>
                            ))}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {assistido && (
                            <button onClick={() => setModalCandidatura(casaRecomendada)} style={{
                              flex: 1, backgroundColor: 'var(--secondary)', color: 'var(--text)',
                              border: 'none', padding: '0.55rem', borderRadius: '8px',
                              fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                            }}>
                              <IconSend size={12} /> Candidatura
                            </button>
                          )}
                          <button onClick={() => setModalVisita(casaRecomendada)} style={{
                            flex: 1, backgroundColor: 'var(--primary)', color: 'white',
                            border: 'none', padding: '0.55rem', borderRadius: '8px',
                            fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                          }}>
                            <IconCalendar size={12} /> Agendar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!assistido && (
                  <div style={{
                    backgroundColor: 'var(--primary)18', border: '2px dashed var(--primary)',
                    borderRadius: '16px', padding: '1.25rem', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                      Cadastre o assistido
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text)', opacity: 0.6, marginBottom: '0.875rem' }}>
                      Para enviar candidaturas, cadastre primeiro os dados do familiar
                    </div>
                    <button onClick={() => setModalAssistido(true)} style={{
                      backgroundColor: 'var(--primary)', color: 'white', border: 'none',
                      padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.82rem',
                      fontWeight: '700', cursor: 'pointer', width: '100%'
                    }}>
                      Cadastrar agora
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ---- ABA: CASAS ---- */}
        {aba === 'casas' && (
          <>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[{ val: '', label: 'Todas' }, ...Object.entries(labelTipo).map(([val, label]) => ({ val, label }))].map(f => (
                <button key={f.val} onClick={() => setFiltroTipo(f.val)} style={{
                  padding: '0.5rem 1rem', borderRadius: '100px', border: '2px solid',
                  borderColor: filtroTipo === f.val ? 'var(--primary)' : 'transparent',
                  backgroundColor: filtroTipo === f.val ? 'var(--primary)' : 'var(--secondary)',
                  color: filtroTipo === f.val ? 'white' : 'var(--text)',
                  fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.15s'
                }}>
                  {f.label}
                </button>
              ))}
            </div>

            {casasFiltradas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text)', opacity: 0.4, fontSize: '0.9rem' }}>
                Nenhuma casa encontrada
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {casasFiltradas.map(casa => (
                  <div key={casa._id} style={{
                    backgroundColor: 'var(--secondary)', borderRadius: '16px',
                    overflow: 'hidden', transition: 'transform 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <div style={{
                      height: '6px',
                      backgroundColor: casa.vagasDisponiveis > 0 ? cores[casa.tipo] : '#d1c2b3'
                    }} />
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: '700', color: cores[casa.tipo], marginBottom: '0.2rem' }}>
                            {labelTipo[casa.tipo]}
                          </div>
                          <div style={{ fontWeight: '800', color: 'var(--text)', fontSize: '1rem' }}>{casa.nome}</div>
                        </div>
                        <div style={{
                          backgroundColor: casa.vagasDisponiveis > 0 ? '#7ab89418' : '#e87c7c18',
                          color: casa.vagasDisponiveis > 0 ? '#7ab894' : '#e87c7c',
                          padding: '0.25rem 0.65rem', borderRadius: '100px',
                          fontSize: '0.75rem', fontWeight: '700', whiteSpace: 'nowrap'
                        }}>
                          {casa.vagasDisponiveis > 0 ? `${casa.vagasDisponiveis} vagas` : 'Sem vagas'}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text)', opacity: 0.55, marginBottom: '0.875rem' }}>
                        {casa.endereco?.bairro}, {casa.endereco?.cidade}
                        {casa.avaliacaoMedia > 0 && ` · ${casa.avaliacaoMedia.toFixed(1)}`}
                      </div>

                      {casa.servicos?.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {casa.servicos.slice(0, 3).map(s => (
                            <span key={s} style={{
                              backgroundColor: 'var(--background)', color: 'var(--text)',
                              padding: '0.2rem 0.55rem', borderRadius: '100px',
                              fontSize: '0.72rem', fontWeight: '500', opacity: 0.7
                            }}>
                              {s.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {assistido && casa.vagasDisponiveis > 0 && (
                          <button onClick={() => setModalCandidatura(casa)} style={{
                            flex: 1, backgroundColor: 'var(--background)', color: 'var(--text)',
                            border: 'none', padding: '0.6rem', borderRadius: '10px',
                            fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem'
                          }}>
                            <IconSend size={13} /> Candidatura
                          </button>
                        )}
                        <button onClick={() => setModalVisita(casa)} style={{
                          flex: 1, backgroundColor: 'var(--primary)', color: 'white',
                          border: 'none', padding: '0.6rem', borderRadius: '10px',
                          fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem'
                        }}>
                          <IconCalendar size={13} /> Agendar visita
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ---- ABA: CANDIDATURAS ---- */}
        {aba === 'candidaturas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!assistido && (
              <div style={{
                backgroundColor: 'var(--secondary)', borderRadius: '16px', padding: '2rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text)', marginBottom: '0.5rem' }}>
                  Cadastre o assistido primeiro
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text)', opacity: 0.55, marginBottom: '1rem' }}>
                  Para enviar candidaturas, você precisa cadastrar os dados do familiar
                </div>
                <button onClick={() => setModalAssistido(true)} style={{
                  backgroundColor: 'var(--primary)', color: 'white', border: 'none',
                  padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.9rem',
                  fontWeight: '700', cursor: 'pointer'
                }}>
                  Cadastrar assistido
                </button>
              </div>
            )}

            {candidaturas.length === 0 && assistido && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text)', opacity: 0.4, fontSize: '0.9rem' }}>
                Nenhuma candidatura enviada ainda
              </div>
            )}

            {candidaturas.map(cand => {
              const cfg = statusCandidaturaConfig[cand.status]
              return (
                <div key={cand._id} style={{
                  backgroundColor: 'var(--secondary)', borderRadius: '16px', padding: '1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      backgroundColor: (cores[cand.casaId?.tipo] || '#80a6c6') + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <IconHome size={18} color={cores[cand.casaId?.tipo] || '#80a6c6'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.95rem' }}>
                        {cand.casaId?.nome || 'Casa'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text)', opacity: 0.5 }}>
                        {cand.assistidoId?.nome} · {new Date(cand.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                      {cand.respostaGestor && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text)', opacity: 0.6, marginTop: '0.25rem', fontStyle: 'italic' }}>
                          "{cand.respostaGestor}"
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: cfg.bg, color: cfg.cor,
                    padding: '0.3rem 0.9rem', borderRadius: '100px',
                    fontSize: '0.78rem', fontWeight: '700'
                  }}>
                    {cfg.label}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ---- ABA: VISITAS ---- */}
        {aba === 'visitas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {visitas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text)', opacity: 0.4, fontSize: '0.9rem' }}>
                Nenhuma visita agendada ainda
              </div>
            ) : visitas.map(visita => {
              const cfg = statusVisitaConfig[visita.status]
              return (
                <div key={visita._id} style={{
                  backgroundColor: 'var(--secondary)', borderRadius: '16px', padding: '1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      backgroundColor: (cores[visita.casaId?.tipo] || '#80a6c6') + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <IconCalendar size={18} color={cores[visita.casaId?.tipo] || '#80a6c6'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text)', fontSize: '0.95rem' }}>
                        {visita.casaId?.nome || 'Casa'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text)', opacity: 0.5 }}>
                        {new Date(visita.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                        {' · '}{visita.horario === 'manha' ? 'Manhã' : 'Tarde'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {visita.status === 'realizada' && (
                      <button onClick={() => setModalAvaliacao(visita)} style={{
                        backgroundColor: '#e8a87c18', color: '#e8a87c',
                        border: 'none', padding: '0.35rem 0.75rem', borderRadius: '8px',
                        fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.3rem'
                      }}>
                        <IconStar size={13} color="#e8a87c" /> Avaliar
                      </button>
                    )}
                    <div style={{
                      backgroundColor: cfg.cor + '20', color: cfg.cor,
                      padding: '0.3rem 0.9rem', borderRadius: '100px',
                      fontSize: '0.78rem', fontWeight: '700'
                    }}>
                      {cfg.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* Modais */}
      {modalAssistido && (
        <ModalAssistido
          onFechar={() => setModalAssistido(false)}
          onSalvo={(a) => { setAssistido(a); setModalAssistido(false) }}
        />
      )}
      {modalCandidatura && assistido && (
        <ModalCandidatura
          casa={modalCandidatura}
          assistido={assistido}
          onFechar={() => setModalCandidatura(null)}
          onEnviado={() => { setModalCandidatura(null); carregarDados() }}
        />
      )}
      {modalVisita && (
        <ModalAgendamento
          casa={modalVisita}
          onFechar={() => setModalVisita(null)}
        />
      )}
      {modalAvaliacao && (
        <ModalAvaliacao
          visita={modalAvaliacao}
          onFechar={() => setModalAvaliacao(null)}
          onSalvo={() => { setModalAvaliacao(null); carregarDados() }}
        />
      )}
    </div>
  )
}