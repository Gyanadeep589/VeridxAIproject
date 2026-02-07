import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getSubmissions,
  getLocalSubmissions,
  getFileDownloadUrl,
  getFileThumbnailUrl,
  getFileSummaryUrl,
  deleteSubmission,
} from '../lib/api'

// ✅ Image import
import logo from '../Images/medico-legal-reporting.jpg'

/* =======================
   Document Preview
======================= */
function DocumentPreview({ doc, thumbnailUrl }) {
  const isPdf = doc?.cvFileName?.toLowerCase().endsWith('.pdf')

  return (
    <div className="w-full h-48 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
      <img
        src={isPdf && thumbnailUrl ? thumbnailUrl : logo}
        alt="Document preview"
        className="max-w-full max-h-full object-contain"
        onError={(e) => (e.currentTarget.src = logo)}
      />
    </div>
  )
}

/* =======================
   Admin Page
======================= */
export default function Admin() {
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [summaries, setSummaries] = useState({})

  const loadData = async () => {
    const fromApi = await getSubmissions()

    if (Array.isArray(fromApi) && fromApi.length > 0) {
      setList(fromApi)

      const next = {}
      for (const doc of fromApi) {
        if (doc?.cvFileName?.toLowerCase().endsWith('.pdf') && doc.hasFile) {
          try {
            const res = await fetch(getFileSummaryUrl(doc.id), { cache: 'no-store' })
            if (res.ok) {
              const ct = res.headers.get('content-type') || ''
              if (ct.includes('application/json')) {
                const data = await res.json()
                next[doc.id] = data.summary || 'No text extracted.'
              } else {
                next[doc.id] = 'Summary not available.'
              }
            } else {
              next[doc.id] = 'Summary not available.'
            }
          } catch {
            next[doc.id] = 'Summary not available.'
          }
        } else {
          next[doc.id] = doc?.hasFile ? 'Summary not available for non-PDF documents.' : 'Summary not available (local storage).'
        }
      }
      setSummaries(next)
    } else {
      setList(getLocalSubmissions())
      const local = getLocalSubmissions()
      const next = {}
      local.forEach((doc) => {
        next[doc.id] = doc?.hasFile ? 'Summary not available for non-PDF documents.' : 'Summary not available (local storage).'
      })
      setSummaries(next)
    }

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return

    setDeleting(id)
    const result = await deleteSubmission(id)
    setDeleting(null)

    if (result.ok) loadData()
    else alert(result.error || 'Failed to delete submission')
  }

  return (
    <div className="min-h-screen bg-medical-mist bg-grid-pattern pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 text-sm font-semibold mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <h1 className="font-display font-bold text-3xl text-medical-navy">
          Document Management
        </h1>

        <p className="mt-4 mb-10 text-slate-600 text-base leading-relaxed">
          VeriDx.ai brings AI-powered intelligence to medical malpractice and documentation review. Here you can view
          and manage expert intake submissions, review document summaries extracted from CVs and reports, and oversee
          materials submitted through our medical expert panel.
        </p>

        {loading ? (
          <p className="text-slate-500">Loading…</p>
        ) : list.length === 0 ? (
          <p className="text-slate-500">No documents yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((doc) => (
              <div
                key={doc.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/admin/document/${doc.id}`)}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/admin/document/${doc.id}`)}
                className="rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-soft-lg hover:border-primary-200 cursor-pointer transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {/* Preview */}
                <div className="p-4 bg-slate-50">
                  <DocumentPreview
                    doc={doc}
                    thumbnailUrl={
                      doc?.hasFile && doc?.cvFileName?.toLowerCase().endsWith('.pdf')
                        ? getFileThumbnailUrl(doc.id)
                        : null
                    }
                  />
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-5">
                  {/* Expert Details */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Expert details
                    </p>

                    <p className="text-base font-semibold text-slate-900">
                      {doc.name || '—'}
                    </p>

                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 12a4 4 0 01-8 0 4 4 0 018 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 14v7m0-7a4 4 0 00-4 4m4-4a4 4 0 014 4" />
                        </svg>
                        {doc.email || '—'}
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 5h2l3 7-1.5 1.5a11 11 0 005 5L13 17l7 3v2a1 1 0 01-1 1A16 16 0 013 6a1 1 0 010-1z" />
                        </svg>
                        {doc.phone || '—'}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Document */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Document
                    </p>

                    {doc.hasFile ? (
                      <a
                        href={getFileDownloadUrl(doc.id)}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 4v12m0 0l4-4m-4 4l-4-4M4 20h16" />
                        </svg>
                        {doc.cvFileName}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400">—</p>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Document summary
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                      {summaries[doc.id] ?? 'Loading…'}
                    </p>
                  </div>

                  {/* Delete */}
                  <div className="pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      disabled={deleting === doc.id}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {deleting === doc.id ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Deleting…
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}