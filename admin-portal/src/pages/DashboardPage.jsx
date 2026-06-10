import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getSummary, getByDistrict, getByCategory } from '../api/adminApi'
import SummaryCards from './components/SummaryCards'
import DistrictSection from './components/DistrictSection'
import CategorySection from './components/CategorySection'

export default function DashboardPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [summary, districts, categories] = await Promise.all([
          getSummary(),
          getByDistrict(),
          getByCategory(),
        ])
        if (!cancelled) setData({ summary, districts, categories })
      } catch (err) {
        if (cancelled) return
        if (err.status === 401 || err.status === 403) {
          logout()
          navigate('/', { replace: true })
          return
        }
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
    <div className="dashboard-page">
      <header className="header">
        <div className="header-inner">
          <span className="badge">SL Police</span>
          <span className="header-title">Admin Portal — Nationwide Collections</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-main">
        {loading && (
          <div className="loading-wrap">
            <div className="spinner" aria-label="Loading reports" />
            <p>Loading report data…</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-message" role="alert">{error}</div>
        )}

        {data && !loading && (
          <>
            <SummaryCards summary={data.summary} />
            <DistrictSection districts={data.districts} />
            <CategorySection categories={data.categories} />
          </>
        )}
      </main>
    </div>
  )
}
