import PaymentForm from './PaymentForm'

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
}

export default function FineDetails({ fine, onPaymentSuccess, onStartOver }) {
  const isPaid = fine.status === 'PAID'

  return (
    <div className="card">
      <div className="card-header-row">
        <h2 className="card-title">Fine Details</h2>
        <span className={`status-badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}`}>
          {fine.status}
        </span>
      </div>

      <dl className="details-grid">
        <dt>Reference Number</dt>
        <dd className="mono">{fine.referenceNumber}</dd>

        <dt>Category</dt>
        <dd>{fine.categoryCode} — {fine.categoryDescription}</dd>

        <dt>Amount Due</dt>
        <dd className="amount">{formatAmount(fine.amount)}</dd>

        <dt>Vehicle Number</dt>
        <dd>{fine.vehicleNumber}</dd>

        <dt>Issued</dt>
        <dd>{formatDate(fine.issuedAt)}</dd>
      </dl>

      {isPaid ? (
        <div className="info-note">
          ✓ This fine has already been paid. No further action is required.
        </div>
      ) : (
        <PaymentForm fine={fine} onPaymentSuccess={onPaymentSuccess} />
      )}

      <button type="button" className="btn-link" onClick={onStartOver}>
        ← Look up a different fine
      </button>
    </div>
  )
}
