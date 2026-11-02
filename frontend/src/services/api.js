
import { auth } from '../firebase'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export async function apiRequest(path, options = {}) {
  const currentUser = auth.currentUser

  if (!currentUser) {
    throw new Error('Please sign in to continue.')
  }

  const token = await currentUser.getIdToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}.`,
    )
  }

  return data
}
