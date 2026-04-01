import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardFamilia from './DashboardFamilia'
import DashboardGestor from './DashboardGestor'
import DashboardAdmin from './DashboardAdmin'

export default function Dashboard() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!usuario) navigate('/login')
  }, [usuario])

  if (!usuario) return null

  if (usuario.role === 'admin') return <DashboardAdmin />
  if (usuario.role === 'gestor') return <DashboardGestor />
  return <DashboardFamilia />
}