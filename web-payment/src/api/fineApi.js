import { API_BASE } from '../config'

export async function lookupFine(referenceNumber, categoryCode) {
  const url = `${API_BASE}/api/fines/lookup?referenceNumber=${encodeURIComponent(referenceNumber)}&categoryCode=${encodeURIComponent(categoryCode)}`
  let res
  try {
    res = await fetch(url)
  } catch {
    throw new Error('Could not reach the server. Please check your connection.')
  }

  if (res.status === 404) {
    throw new Error('Fine not found. Check the reference number.')
  }
  if (res.status === 400) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Category code does not match this fine reference.')
  }
  if (!res.ok) {
    throw new Error('An unexpected error occurred. Please try again.')
  }
  return res.json()
}

export async function processPayment({ referenceNumber, categoryCode, paymentMethod, amount }) {
  let res
  try {
    res = await fetch(`${API_BASE}/api/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceNumber, categoryCode, paymentMethod, amount }),
    })
  } catch {
    throw new Error('Could not reach the server. Please check your connection.')
  }

  if (res.status === 409) {
    throw new Error('This fine has already been paid.')
  }
  if (res.status === 400) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Payment could not be processed. Please check the details.')
  }
  if (!res.ok) {
    throw new Error('Payment failed. Please try again.')
  }
  return res.json()
}
