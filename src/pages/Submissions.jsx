import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  getSubmissions,
  getLocalSubmissions,
  getFileDownloadUrl,
  deleteSubmission,
} from '../lib/api'

export default function Submissions() {
  const [list, setList] = useState([])
  const [source, setSource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const fromApi = await getSubmissions()
      if (cancelled) return
      if (fromApi && Array.isArray(fromApi) && fromApi.length >= 0) {
        setList(fromApi)
        setSource('api')
      } else {
        const local = getLocalSubmissions()
        setList(local)
        setSource('local')
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this submission?')) return
    setDeleting(id)
    const result = await deleteSubmission(id)
    setDeleting(null)
    if (result.ok) {
      // Reload the list
      if (source === 'api') {
        const fromApi = await getSubmissions()
        if (fromApi && Array.isArray(fromApi)) {
          setList(fromApi)
        } else {
          const local = getLocalSubmissions()
          setList(local)
          setSource('local')
        }
      } else {
        const local = getLocalSubmissions()
        setList(local)
      }
    } else {
      alert(result.error || 'Failed to delete submission')
    }
  }

  return (
    <div className="min-h-screen bg-medical-mist bg-grid-pattern pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 text-sm font-semibold mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-soft-lg">
          <span className="section-label">Data & documents</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-medical-navy mt-2">
            Expert intake submissions
          </h1>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Stored data and uploaded documents from the medical expert intake form.
          </p>

          {loading ? (
            <p className="mt-8 text-slate-500">Loading…</p>
          ) : list.length === 0 ? (
            <p className="mt-8 text-slate-500">No submissions yet.</p>
          ) : (
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Name
                    </th>
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Phone
                    </th>
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email
                    </th>
                    <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      CV / document
                    </th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Submitted
                    </th>
                    <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100">
                      <td className="py-4 pr-4 font-medium text-slate-800">{row.name}</td>
                      <td className="py-4 pr-4 text-slate-600">{row.phone}</td>
                      <td className="py-4 pr-4 text-slate-600">{row.email}</td>
                      <td className="py-4 pr-4">
                        {row.hasFile && getFileDownloadUrl(row.id) ? (
                          <a
                            href={getFileDownloadUrl(row.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 font-semibold hover:underline"
                          >
                            {row.cvFileName || 'Download'}
                          </a>
                        ) : (
                          <span className="text-slate-400 text-sm">
                            {row.cvFileName || '—'}
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-slate-500 text-sm">
                        {row.submittedAt
                          ? new Date(row.submittedAt).toLocaleString()
                          : '—'}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleDelete(row.id)}
                          disabled={deleting === row.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete submission"
                        >
                          {deleting === row.id ? (
                            <>
                              <svg className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
