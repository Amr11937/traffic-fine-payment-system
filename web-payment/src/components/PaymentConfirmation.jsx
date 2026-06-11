import { motion } from 'framer-motion'
import SuccessCheck from './SuccessCheck'
import { fadeUpItem, easeOut } from '../motion/variants'

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
}

// Details fade in only after the checkmark has drawn itself.
const detailsContainer = {
  hidden: {},
  show: { transition: { delayChildren: 1.0, staggerChildren: 0.08 } },
}

function Row({ label, children }) {
  return (
    <motion.div className="detail-row" variants={fadeUpItem}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </motion.div>
  )
}

export default function PaymentConfirmation({ payment, fine, onStartOver }) {
  return (
    <div className="card">
      <div className="success-block">
        <SuccessCheck />
        <motion.h2
          className="success-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7, ease: easeOut }}
        >
          Payment Successful
        </motion.h2>
        <motion.p
          className="success-sub"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.82, ease: easeOut }}
        >
          Your fine has been settled. Please keep this confirmation for your records.
        </motion.p>
      </div>

      <motion.dl
        className="details-grid"
        variants={detailsContainer}
        initial="hidden"
        animate="show"
        style={{ marginTop: '1.5rem' }}
      >
        <Row label="Transaction Reference">
          <span className="mono">{payment.transactionReference}</span>
        </Row>
        <Row label="Fine Reference">
          <span className="mono">{payment.referenceNumber}</span>
        </Row>
        <Row label="Amount Paid">
          <span className="amount">{formatAmount(fine.amount)}</span>
        </Row>
        <Row label="Status">
          <span className="status-badge badge-paid">PAID</span>
        </Row>
        <Row label="Paid At">{formatDate(payment.paidAt)}</Row>
      </motion.dl>

      <motion.div
        className="sms-note"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.5, ease: easeOut }}
      >
        <svg
          className="note-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="6" y="3" width="12" height="18" rx="2.5" stroke="currentColor" strokeWidth="2" />
          <path d="M10.5 18h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span>The issuing officer has been notified via SMS.</span>
      </motion.div>

      <motion.button
        type="button"
        className="btn-link"
        onClick={onStartOver}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.65 }}
        whileHover={{ x: -3 }}
      >
        ← Pay another fine
      </motion.button>
    </div>
  )
}
