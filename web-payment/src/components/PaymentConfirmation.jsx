function formatDate(iso) {
  return new Date(iso).toLocaleString('en-LK', { dateStyle: 'medium', timeStyle: 'short' })
}

function formatAmount(amount) {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
}

export default function PaymentConfirmation({ payment, fine, onStartOver }) {
  return (
    <div className="card">
      <div className="success-header">
        <span className="success-icon">✓</span>
        <h2 className="card-title">Payment Successful</h2>
      </div>
      <p className="card-subtitle">
        Your fine has been settled. Please keep this confirmation for your records.
      </p>

      <dl className="details-grid">
        <dt>Transaction Reference</dt>
        <dd className="mono">{payment.transactionReference}</dd>

        <dt>Fine Reference</dt>
        <dd className="mono">{payment.referenceNumber}</dd>

        <dt>Amount Paid</dt>
        <dd className="amount">{formatAmount(fine.amount)}</dd>

        <dt>Status</dt>
        <dd><span className="status-badge badge-paid">PAID</span></dd>

        <dt>Paid At</dt>
        <dd>{formatDate(payment.paidAt)}</dd>
      </dl>

      <div className="sms-note">
        📱 The issuing officer has been notified via SMS.
      </div>

      <button type="button" className="btn-link" onClick={onStartOver}>
        ← Pay another fine
      </button>
    </div>
  )
}
