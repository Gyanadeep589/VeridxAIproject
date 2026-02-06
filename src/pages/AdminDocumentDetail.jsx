import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  getSubmissions,
  getLocalSubmissions,
  getFileDownloadUrl,
  getFileThumbnailUrl,
  getFileSummaryUrl,
  deleteSubmission,
} from '../lib/api'

import logo from '../Images/medico-legal-reporting.jpg'

export default function AdminDocumentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doc, setDoc] = useState(null)
  const [fullSummary, setFullSummary] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const fromApi = await getSubmissions()
      const list = Array.isArray(fromApi) ? fromApi : getLocalSubmissions()
      const found = list.find((d) => d.id === id)
      if (cancelled) return
      setDoc(found || null)
      if (found?.cvFileName?.toLowerCase().endsWith('.pdf') && found?.hasFile) {
        try {
          const url = `${getFileSummaryUrl(id)}?full=1&_=${Date.now()}`
          const res = await fetch(url)
          const data = res.ok ? await res.json() : {}
          if (!cancelled) setFullSummary(data.summary || 'Unable to extract summary.')
        } catch {
          if (!cancelled) setFullSummary('Unable to extract summary.')
        }
      } else {
        setFullSummary('Summary not available for non-PDF documents.')
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this submission?')) return
    setDeleting(true)
    const result = await deleteSubmission(id)
    setDeleting(false)
    if (result.ok) {
      navigate('/admin')
    } else {
      alert(result.error || 'Failed to delete submission')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-medical-mist bg-grid-pattern pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-medical-mist bg-grid-pattern pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-500">Document not found.</p>
          <Link to="/admin" className="mt-4 inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline">
            ← Back to Document Management
          </Link>
        </div>
      </div>
    )
  }

  const thumbnailUrl = doc?.cvFileName?.toLowerCase().endsWith('.pdf') ? getFileThumbnailUrl(doc.id) : null

  return (
    <div className="min-h-screen bg-medical-mist bg-grid-pattern pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 text-sm font-semibold mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Document Management
        </Link>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-soft-lg overflow-hidden">
          {/* Preview */}
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <div className="aspect-video max-h-64 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
              <img
                src={thumbnailUrl || logo}
                alt="Document preview"
                className="max-w-full max-h-full object-contain"
                onError={(e) => (e.currentTarget.src = logo)}
              />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Expert details */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Expert details</p>
              <p className="text-xl font-bold text-slate-900">{doc.name || '—'}</p>
              <div className="mt-3 space-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {doc.email || '—'}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {doc.phone || '—'}
                </div>
              </div>
              {doc.submittedAt && (
                <p className="mt-2 text-sm text-slate-500">
                  Submitted {new Date(doc.submittedAt).toLocaleString()}
                </p>
              )}
            </div>

            {/* Document */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Document</p>
              {doc.hasFile ? (
                <a
                  href={getFileDownloadUrl(doc.id)}
                  download
                  className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l4-4m-4 4l-4-4M4 20h16" />
                  </svg>
                  {doc.cvFileName}
                </a>
              ) : (
                <p className="text-slate-400">—</p>
              )}
            </div>

            {/* Full document summary */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Complete document summary</p>
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 max-h-[500px] overflow-y-auto">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{fullSummary || 'Loading…'}</p>
              </div>
            </div>

            {/* Delete */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 font-semibold hover:bg-red-50 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Deleting…
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete submission
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
