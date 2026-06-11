import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'
import { loginUser } from '../api/adminApi'
import AnimatedField from '../components/AnimatedField'
import ErrorMessage from '../components/ErrorMessage'
import { pageVariants, staggerContainer, fadeUpItem, buttonMotion } from '../motion/variants'

export default function LoginPage() {
  const { token, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(username, password)
      if (res.status === 401) { setError('Invalid username or password.'); return }
      if (!res.ok) { setError(`Login failed (${res.status}). Please try again.`); return }
      const data = await res.json()
      login(data.token)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Could not reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = !loading && username.trim() && password

  return (
    <motion.div
      className="login-page bg-login"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <header className="header">
        <div className="header-inner">
          <img src="/police-logo.png" alt="Sri Lanka Police" className="header-logo" />
          <div className="header-text">
            <span className="header-title">Traffic Fine System — Admin Portal</span>
          </div>
        </div>
      </header>

      <main className="login-main">
        <motion.div
          className="card login-card"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Centred logo / brand block */}
          <motion.div className="login-logo" variants={fadeUpItem}>
            <img src="/police-logo.png" alt="Sri Lanka Police" className="login-logo-img" />
          </motion.div>

          <motion.h2 className="login-heading" variants={fadeUpItem}>
            Officer Sign In
          </motion.h2>
          <motion.p className="login-sub" variants={fadeUpItem}>
            Authorised personnel only
          </motion.p>

          <AnimatePresence>
            {error && <ErrorMessage key="err" message={error} />}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <motion.div variants={fadeUpItem}>
              <AnimatedField
                id="username"
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
                autoFocus
                autoComplete="username"
              />
            </motion.div>

            <motion.div variants={fadeUpItem}>
              <AnimatedField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </motion.div>

            <motion.button
              type="submit"
              className="btn-primary btn-full"
              disabled={!canSubmit}
              variants={fadeUpItem}
              whileHover={canSubmit ? buttonMotion.whileHover : undefined}
              whileTap={canSubmit ? buttonMotion.whileTap : undefined}
              transition={buttonMotion.transition}
            >
              {loading
                ? <><span className="spinner-inline" aria-hidden="true" /> Signing in…</>
                : 'Sign In'
              }
            </motion.button>
          </form>
        </motion.div>
      </main>
    </motion.div>
  )
}
