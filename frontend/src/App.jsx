import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/layout/Navbar'
import LandingPage from './pages/landing/LandingPage'
import Login from './pages/auth/Login'
import Cadastro from './pages/auth/Cadastro'
import Dashboard from './pages/dashboard/Dashboard'
import DashboardAdmin from './pages/dashboard/DashboardAdmin'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const id = decodeURIComponent(hash.replace('#', ''))

    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  }, [pathname, hash])

  return null
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToHash />
          <Navbar />
          <div style={{ paddingTop: '70px' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/buscar-casas" element={<LandingPage />} />
              <Route path="/casas" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<DashboardAdmin />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
