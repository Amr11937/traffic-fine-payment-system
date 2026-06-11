import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../auth/AuthContext'
import { getSummary, getByDistrict, getByCategory } from '../api/adminApi'
import SummaryCards from './components/SummaryCards'
import DistrictSection from './components/DistrictSection'
import CategorySection from './components/CategorySection'
import SkeletonDashboard from '../components/SkeletonDashboard'
import { pageVariants, sectionStagger, fadeUpItem, buttonMotion } from '../motion/variants'

export default function DashboardPage() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [summary, districts, categories] = await Promise.all([
          getSummary(), getByDistrict(), getByCategory(),
        ])
        if (!cancelled) setData({ summary, districts, categories })
      } catch (err) {
        if (cancelled) return
        if (err.status === 401 || err.status === 403) { logout(); navigate('/', { replace: true }); return }
        setError('Failed to load report data. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [logout, navigate])

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <motion.div
      className="dashboard-page bg-dashboard"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <header className="header">
        <div className="header-inner">
          <img src="/police-logo.png" alt="Sri Lanka Police" className="header-logo" />
          <div className="header-text">
            <span className="header-title">Admin Portal — Nationwide Collections</span>
          </div>
        </div>

        <motion.button
          className="btn-logout"
          onClick={handleLogout}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={buttonMotion.transition}
        >
          Sign Out
        </motion.button>
      </header>

      <main className="dashboard-main">
        {loading && <SkeletonDashboard />}

        {error && !loading && (
          <div className="dashboard-error">
            <div className="err-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1.1" fill="currentColor" />
              </svg>
            </div>
            <p>{error}</p>
          </div>
        )}

        {data && !loading && (
          <motion.div variants={sectionStagger} initial="hidden" animate="show">
            <motion.div variants={fadeUpItem}>
              <SummaryCards summary={data.summary} />
            </motion.div>
            <motion.div variants={fadeUpItem}>
              <DistrictSection districts={data.districts} />
            </motion.div>
            <motion.div variants={fadeUpItem}>
              <CategorySection categories={data.categories} />
            </motion.div>
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}
