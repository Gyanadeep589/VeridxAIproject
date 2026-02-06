const API_BASE = import.meta.env.VITE_API_URL || ''
const API_PATH = (API_BASE || '') + '/api/expert-intake'

export async function getSubmissions() {
  try {
    const res = await fetch(API_PATH || '/api/expert-intake')
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function submitExpertIntake(formData) {
  try {
    const res = await fetch(API_PATH || '/api/expert-intake', {
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
  return `${API_PATH}/${id}/file`
}

export function getFilePreviewUrl(id) {
  return `${API_PATH}/${id}/preview`
}

export function getFileThumbnailUrl(id) {
  return `${API_PATH}/${id}/thumbnail`
}

export function getFileSummaryUrl(id) {
  return `${API_PATH}/${id}/summary`
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

export async function updateSubmission(id, { description, documentSummary }) {
  if (API_PATH) {
    try {
      const res = await fetch(`${API_PATH}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, documentSummary }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return { ok: false, error: err.error || res.statusText }
      }
      return { ok: true, data: await res.json() }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }
  // Local fallback (when API_PATH is empty - e.g. static deploy)
  try {
    const list = getLocalSubmissions()
    const idx = list.findIndex((item) => item.id === id)
    if (idx === -1) return { ok: false, error: 'Not found' }
    if (description !== undefined) list[idx].description = description?.trim() || null
    if (documentSummary !== undefined) list[idx].documentSummary = documentSummary?.trim() || null
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return { ok: true, data: list[idx] }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

export async function deleteSubmission(id) {
  if (API_PATH) {
    try {
      const res = await fetch(`${API_PATH}/${id}`, {
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
