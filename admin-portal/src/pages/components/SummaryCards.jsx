import { motion } from 'framer-motion'
import useCountUp from '../../hooks/useCountUp'
import { staggerContainer, fadeUpItem } from '../../motion/variants'

const fmtAmount = (n) =>
  Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const fmtCount = (n) => Math.round(n).toLocaleString('en-LK')

// Each card handles its own countup so stagger delay feeds into it naturally.
function StatCard({ label, rawValue, display, accentClass, iconClass, icon, delay }) {
  const animated = useCountUp(rawValue, { duration: 1400, delay: delay * 1000 })

  return (
    <motion.div
      className={`stat-card ${accentClass}`}
      variants={fadeUpItem}
      whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(15,26,44,0.12)' }}
      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
    >
      <div className={`stat-icon ${iconClass}`} aria-hidden="true">{icon}</div>
      <p className="stat-label">{label}</p>
      <p className={`stat-value ${accentClass.replace('accent-', '')}`}>
        {display(animated)}
      </p>
    </motion.div>
  )
}

export default function SummaryCards({ summary }) {
  return (
    <motion.section
      className="stats-grid"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <StatCard
        label="Total Collected"
        rawValue={Number(summary.totalCollected)}
        display={(v) => `LKR ${fmtAmount(v)}`}
        accentClass="accent-blue"
        iconClass="blue"
        delay={0.1}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="6" width="20" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="7" cy="15" r="1.2" fill="currentColor" />
          </svg>
        }
      />

      <StatCard
        label="Fines Paid"
        rawValue={Number(summary.paidCount)}
        display={(v) => fmtCount(v)}
        accentClass="accent-green"
        iconClass="green"
        delay={0.18}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 12.2l3 3 5-5.5" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      />

      <StatCard
        label="Fines Unpaid"
        rawValue={Number(summary.unpaidCount)}
        display={(v) => fmtCount(v)}
        accentClass="accent-amber"
        iconClass="amber"
        delay={0.26}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 7.5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1.1" fill="currentColor" />
          </svg>
        }
      />
    </motion.section>
  )
}
