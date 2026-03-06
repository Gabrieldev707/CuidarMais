import { useAuth } from '../../contexts/AuthContext'
import DashboardFamilia from './DashboardFamilia'
import DashboardGestor from './DashboardGestor'

export default function Dashboard() {
  const { usuario } = useAuth()

  if (!usuario) return null

  return usuario.role === 'gestor'
    ? <DashboardGestor />
    : <DashboardFamilia />
}