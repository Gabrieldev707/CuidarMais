import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null
  })

  const login = (dadosUsuario, tokenJWT) => {
    setUsuario(dadosUsuario)
    setToken(tokenJWT)
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario))
    localStorage.setItem('token', tokenJWT)
  }

  const logout = () => {
    setUsuario(null)
    setToken(null)
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}