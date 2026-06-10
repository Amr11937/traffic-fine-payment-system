import { useState } from 'react'
import { lookupFine } from '../api/fineApi'
import ErrorMessage from './ErrorMessage'
import LoadingSpinner from './LoadingSpinner'

export default function LookupForm({ onFineFound }) {
  const [referenceNumber, setReferenceNumber] = useState('')
  const [categoryCode, setCategoryCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const fine = await lookupFine(referenceNumber.trim(), categoryCode.trim().toUpperCase())
      onFineFound(fine)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="card-title">Look Up Your Fine</h2>
      <p className="card-subtitle">
        Enter the reference number and category code from your traffic fine notice.
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="refNum" className="field-label">Fine Reference Number</label>
          <input
            id="refNum"
            type="text"
            className="field-input"
            placeholder="e.g. TF-20260610-001"
            value={referenceNumber}
            onChange={e => setReferenceNumber(e.target.value)}
            required
            disabled={loading}
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="catCode" className="field-label">Category Code</label>
          <input
            id="catCode"
            type="text"
            className="field-input"
            placeholder="e.g. SPD"
            value={categoryCode}
            onChange={e => setCategoryCode(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <ErrorMessage message={error} />}
        <button
          type="submit"
          className="btn-primary"
          disabled={loading || !referenceNumber.trim() || !categoryCode.trim()}
        >
          {loading ? <><LoadingSpinner /> Looking up…</> : 'Look Up Fine'}
        </button>
      </form>
    </div>
  )
}
