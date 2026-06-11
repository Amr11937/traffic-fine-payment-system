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
          <span className="header-emblem" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.5 19 5.2v6c0 4.6-3 7.9-7 9.3-4-1.4-7-4.7-7-9.3v-6L12 2.5Z"
                fill="rgba(255,255,255,0.14)"
                stroke="#f0b429"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="header-text">
            <span className="header-eyebrow">Sri Lanka Police</span>
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
            <div className="login-emblem" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2.5 19 5.2v6c0 4.6-3 7.9-7 9.3-4-1.4-7-4.7-7-9.3v-6L12 2.5Z"
                  fill="rgba(255,255,255,0.16)"
                  stroke="#f0b429"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12.2 11.4 14.6l3.8-4"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="login-brand">Sri Lanka Police</span>
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
