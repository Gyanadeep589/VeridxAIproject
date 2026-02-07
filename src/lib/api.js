/* =========================================================
   API configuration
   IMPORTANT:
   - Do NOT use full domain URLs on Vercel
   - Relative path avoids CORS and preview issues
========================================================= */

const API_PATH = '/api/expert-intake'

/* =========================================================
   Helpers
========================================================= */

function isJsonResponse(res) {
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json')
}

/* =========================================================
   Read submissions
========================================================= */

export async function getSubmissions() {
  try {
    const res = await fetch(API_PATH, { cache: 'no-store' })

    if (!res.ok || res.status === 404 || res.status === 405 || !isJsonResponse(res)) return null
    return await res.json()
  } catch {
    return null
  }
}

/* =========================================================
   Submit expert intake
========================================================= */

export async function submitExpertIntake(formData) {
  try {
    const res = await fetch(API_PATH, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    })

    if (res.ok && isJsonResponse(res)) {
      return { ok: true, data: await res.json() }
    }

    if (!res.ok && (res.status === 404 || res.status === 405)) {
      return { ok: false, error: 'API unavailable', fallback: true }
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.error || res.statusText }
    }

    if (!isJsonResponse(res)) {
      return { ok: false, error: 'API unavailable', fallback: true }
    }

    return { ok: true, data: await res.json() }
  } catch (e) {
    return { ok: false, error: e.message, fallback: true }
  }
}

/* =========================================================
   File URLs
========================================================= */

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

/* =========================================================
   Local storage fallback
========================================================= */

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

  list.push({
    ...entry,
    id: entry.id || `local-${Date.now()}`,
    hasFile: false,
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

/* =========================================================
   Update submission
========================================================= */

export async function updateSubmission(id, { description, documentSummary }) {
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
    // Fallback to local storage
    try {
      const list = getLocalSubmissions()
      const idx = list.findIndex((item) => item.id === id)
      if (idx === -1) return { ok: false, error: 'Not found' }

      if (description !== undefined)
        list[idx].description = description?.trim() || null

      if (documentSummary !== undefined)
        list[idx].documentSummary = documentSummary?.trim() || null

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
      return { ok: true, data: list[idx] }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }
}

/* =========================================================
   Delete submission
========================================================= */

export async function deleteSubmission(id) {
  try {
    const res = await fetch(`${API_PATH}/${id}`, {
      method: 'DELETE',
      cache: 'no-store',
    })

    if (res.ok && isJsonResponse(res)) {
      await res.json()
      return { ok: true }
    }

    if (!res.ok && (res.status === 404 || res.status === 405)) {
      const list = getLocalSubmissions()
      const filtered = list.filter((item) => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      return { ok: true }
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.error || res.statusText }
    }

    const list = getLocalSubmissions()
    const filtered = list.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return { ok: true }
  } catch (e) {
    try {
      const list = getLocalSubmissions()
      const filtered = list.filter((item) => item.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }
}
