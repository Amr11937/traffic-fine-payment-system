import { motion } from 'framer-motion'
import PaymentForm from './PaymentForm'
import { staggerContainer, fadeUpItem } from '../motion/variants'

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
}

function Row({ label, children }) {
  return (
    <motion.div className="detail-row" variants={fadeUpItem}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </motion.div>
  )
}

export default function FineDetails({ fine, onPaymentSuccess, onStartOver }) {
  const isPaid = fine.status === 'PAID'

  return (
    <motion.div
      className="card"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div className="card-header-row" variants={fadeUpItem}>
        <h2 className="card-title">Fine Details</h2>
        <span className={`status-badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}`}>
          {fine.status}
        </span>
      </motion.div>

      <dl className="details-grid">
        <Row label="Reference Number">
          <span className="mono">{fine.referenceNumber}</span>
        </Row>
        <Row label="Category">
          {fine.categoryCode} — {fine.categoryDescription}
        </Row>
        <Row label="Vehicle Number">{fine.vehicleNumber}</Row>
        <Row label="Issued">{formatDate(fine.issuedAt)}</Row>
      </dl>

      <motion.div className="amount-panel" variants={fadeUpItem}>
        <span className="amount-label">Amount Due</span>
        <span className="amount-value">{formatAmount(fine.amount)}</span>
      </motion.div>

      {isPaid ? (
        <motion.div className="info-note" variants={fadeUpItem}>
          <svg
            className="note-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path
              d="M8.5 12.2 11 14.6l4.6-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>This fine has already been paid. No further action is required.</span>
        </motion.div>
      ) : (
        <PaymentForm fine={fine} onPaymentSuccess={onPaymentSuccess} />
      )}

      <motion.button
        type="button"
        className="btn-link"
        onClick={onStartOver}
        variants={fadeUpItem}
        whileHover={{ x: -3 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        ← Look up a different fine
      </motion.button>
    </motion.div>
  )
}
