import { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))

  const login = (t) => {
    localStorage.setItem('admin_token', t)
    setToken(t)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

export function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/" replace />
}
