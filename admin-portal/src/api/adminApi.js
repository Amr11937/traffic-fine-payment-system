import { API_BASE } from '../config'

function authHeaders() {
  const token = localStorage.getItem('admin_token')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() })
  if (res.status === 401 || res.status === 403) {
    const err = new Error('Unauthorized')
    err.status = res.status
    throw err
  }
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export function loginUser(username, password) {
  return fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

export const getSummary    = () => apiFetch('/api/admin/reports/summary')
export const getByDistrict = () => apiFetch('/api/admin/reports/by-district')
export const getByCategory = () => apiFetch('/api/admin/reports/by-category')
