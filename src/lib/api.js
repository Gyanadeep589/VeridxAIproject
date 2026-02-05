const API_BASE = import.meta.env.VITE_API_URL || ''

export async function getSubmissions() {
  if (!API_BASE) return null
  try {
    const res = await fetch(`${API_BASE}/api/expert-intake`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function submitExpertIntake(formData) {
  if (!API_BASE) return { ok: false, fallback: true }
  try {
    const res = await fetch(`${API_BASE}/api/expert-intake`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.error || res.statusText }
    }
    const data = await res.json()
    return { ok: true, data }
  } catch (e) {
    return { ok: false, error: e.message, fallback: true }
  }
}

export function getFileDownloadUrl(id) {
  if (!API_BASE) return null
  return `${API_BASE}/api/expert-intake/${id}/file`
}

export const STORAGE_KEY = 'veridx_expert_submissions'

export function getLocalSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveLocalSubmission(entry) {
  const list = getLocalSubmissions()
  list.push({ ...entry, id: entry.id || `local-${Date.now()}`, hasFile: false })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export async function deleteSubmission(id) {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/expert-intake/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return { ok: false, error: err.error || res.statusText }
      }
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message, fallback: true }
    }
  }
  // Fallback to localStorage
  try {
    const list = getLocalSubmissions()
    const filtered = list.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}
