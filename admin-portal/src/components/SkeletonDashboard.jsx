import { motion } from 'framer-motion'
import { staggerContainer, fadeUpItem } from '../motion/variants'

function SkeletonLine({ w = '100%', h = 14, mb = 0 }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, marginBottom: mb, borderRadius: 6 }}
    />
  )
}

function SkeletonStatCard({ delay }) {
  return (
    <motion.div className="skeleton-card" variants={fadeUpItem} transition={{ delay }}>
      <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, marginBottom: 16 }} />
      <SkeletonLine w="55%" h={10} mb={10} />
      <SkeletonLine w="70%" h={28} />
    </motion.div>
  )
}

function SkeletonSection() {
  return (
    <motion.div className="report-section" variants={fadeUpItem}>
      <SkeletonLine w="38%" h={16} mb={20} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(5)].map((_, i) => (
            <SkeletonLine key={i} w={`${78 - i * 6}%`} h={12} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 220, borderRadius: 8 }} />
      </div>
    </motion.div>
  )
}

export default function SkeletonDashboard() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      {/* Stats row */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <SkeletonStatCard delay={0} />
        <SkeletonStatCard delay={0.08} />
        <SkeletonStatCard delay={0.16} />
      </div>

      <SkeletonSection />
      <SkeletonSection />
    </motion.div>
  )
}
