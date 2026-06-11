import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { processPayment } from '../api/fineApi'
import ErrorMessage from './ErrorMessage'
import LoadingSpinner from './LoadingSpinner'
import { buttonMotion } from '../motion/variants'

const PAYMENT_METHODS = [
  { value: 'CARD', label: 'Credit / Debit Card' },
  { value: 'ONLINE', label: 'Online Banking' },
  { value: 'CASH', label: 'Cash' },
]

function formatAmount(amount) {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
}

export default function PaymentForm({ fine, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState('CARD')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handlePay() {
    setError(null)
    setLoading(true)
    try {
      const result = await processPayment({
        referenceNumber: fine.referenceNumber,
        categoryCode: fine.categoryCode,
        paymentMethod,
        amount: fine.amount,
      })
      onPaymentSuccess(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="payment-section">
      <h3 className="section-title">Select a Payment Method</h3>
      <div className="method-group">
        {PAYMENT_METHODS.map(m => {
          const selected = paymentMethod === m.value
          return (
            <motion.label
              key={m.value}
              className={`method-option${selected ? ' selected' : ''}`}
              whileHover={!loading ? { scale: 1.01 } : undefined}
              whileTap={!loading ? { scale: 0.99 } : undefined}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.value}
                checked={selected}
                onChange={() => setPaymentMethod(m.value)}
                disabled={loading}
              />
              {m.label}
            </motion.label>
          )
        })}
      </div>

      <AnimatePresence>
        {error && <ErrorMessage key="err" message={error} />}
      </AnimatePresence>

      <motion.button
        type="button"
        className="btn-primary btn-pay"
        onClick={handlePay}
        disabled={loading}
        whileHover={!loading ? buttonMotion.whileHover : undefined}
        whileTap={!loading ? buttonMotion.whileTap : undefined}
        transition={buttonMotion.transition}
      >
        {loading ? (
          <>
            <LoadingSpinner /> Processing payment…
          </>
        ) : (
          `Pay ${formatAmount(fine.amount)}`
        )}
      </motion.button>
    </div>
  )
}
