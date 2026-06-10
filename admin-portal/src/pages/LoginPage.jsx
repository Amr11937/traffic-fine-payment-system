import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { loginUser } from '../api/adminApi'

export default function LoginPage() {
  const { token, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) {
    navigate('/dashboard', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(username, password)
      if (res.status === 401) {
        setError('Invalid username or password.')
        return
      }
      if (!res.ok) {
        setError(`Login failed (${res.status}). Please try again.`)
        return
      }
      const data = await res.json()
      login(data.token)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Could not reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <header className="header">
        <div className="header-inner">
          <span className="badge">SL Police</span>
          <span className="header-title">Traffic Fine System — Admin Portal</span>
        </div>
      </header>

      <main className="login-main">
        <div className="card login-card">
          <h2 className="login-heading">Officer Sign In</h2>
          <p className="login-sub">Authorised personnel only</p>

          {error && (
            <div className="error-message" role="alert">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
