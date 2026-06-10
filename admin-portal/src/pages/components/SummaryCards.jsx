const fmt = (n) =>
  Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function SummaryCards({ summary }) {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <p className="stat-label">Total Collected</p>
        <p className="stat-value">LKR {fmt(summary.totalCollected)}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Fines Paid</p>
        <p className="stat-value paid">{Number(summary.paidCount).toLocaleString()}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Fines Unpaid</p>
        <p className="stat-value unpaid">{Number(summary.unpaidCount).toLocaleString()}</p>
      </div>
    </section>
  )
}
