import { useState } from 'react'
import { processPayment } from '../api/fineApi'
import ErrorMessage from './ErrorMessage'
import LoadingSpinner from './LoadingSpinner'

const PAYMENT_METHODS = [
  { value: 'CARD',   label: 'Credit / Debit Card' },
  { value: 'ONLINE', label: 'Online Banking' },
  { value: 'CASH',   label: 'Cash' },
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
      <h3 className="section-title">Pay Now</h3>
      <div className="method-group">
        {PAYMENT_METHODS.map(m => (
          <label
            key={m.value}
            className={`method-option${paymentMethod === m.value ? ' selected' : ''}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={m.value}
              checked={paymentMethod === m.value}
              onChange={() => setPaymentMethod(m.value)}
              disabled={loading}
            />
            {m.label}
          </label>
        ))}
      </div>
      {error && <ErrorMessage message={error} />}
      <button
        type="button"
        className="btn-primary btn-pay"
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? <><LoadingSpinner /> Processing…</> : `Pay ${formatAmount(fine.amount)}`}
      </button>
    </div>
  )
}
