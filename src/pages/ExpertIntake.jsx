import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitExpertIntake, saveLocalSubmission } from '../lib/api'

const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx'
const MAX_FILE_SIZE_MB = 10

export default function ExpertIntake() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    cv: null,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      setForm((prev) => ({ ...prev, cv: null }))
      setErrors((prev) => ({ ...prev, cv: null }))
      return
    }
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024
    if (file.size > maxBytes) {
      setErrors((prev) => ({ ...prev, cv: `File must be under ${MAX_FILE_SIZE_MB} MB` }))
      setForm((prev) => ({ ...prev, cv: null }))
      return
    }
    setForm((prev) => ({ ...prev, cv: file }))
    setErrors((prev) => ({ ...prev, cv: null }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.phone.trim()) next.phone = 'Phone number is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email'
    if (!form.cv) next.cv = 'Please upload your CV'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return
    setSubmitting(true)
    const formData = new FormData()
    formData.append('name', form.name.trim())
    formData.append('phone', form.phone.trim())
    formData.append('email', form.email.trim())
    if (form.cv) formData.append('cv', form.cv)
    const result = await submitExpertIntake(formData)
    setSubmitting(false)
    if (result.ok) {
      setSubmitted(true)
      return
    }
    if (result.fallback) {
      saveLocalSubmission({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        cvFileName: form.cv?.name || null,
        submittedAt: new Date().toISOString(),
      })
      setSubmitted(true)
      return
    }
    setSubmitError(result.error || 'Submission failed. Please try again.')
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-medical-mist bg-grid-pattern pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-100 text-primary-600 mb-8 shadow-soft">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-medical-navy">
            Thank you for submitting
          </h1>
          <p className="mt-4 text-slate-600 text-lg">
            We&apos;ll review your information and be in touch.
          </p>
          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-medical-mist bg-grid-pattern pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 text-sm font-semibold mb-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Content */}
          <div className="lg:col-span-6 space-y-7">
            <div>
              <div className="badge">
                <span className="size-2 rounded-full bg-primary-600" />
                <span>Medical Expert Panel intake</span>
              </div>
              <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Share your details to be considered for our confidential panel.
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
                Engagements with medical experts are selective and case-based. All fields
                below are required so our team can understand your background and areas of
                expertise.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-7">
              <div className="text-sm font-semibold text-slate-900">
                How we work with experts
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Participation on the VeriDx.ai Medical Expert Panel is not automatic. This
                intake helps us understand your clinical background, specialties, and
                experience with medical malpractice or documentation review.
              </p>
              <ul className="mt-4 grid gap-2 text-sm text-slate-600">
                <li>• Focus on documentation quality and medical evidence</li>
                <li>• Engagements scoped to specific cases and questions</li>
                <li>• Materials and discussions handled confidentially</li>
              </ul>
              <p className="mt-4 fine-print">
                Completing this form does not create an engagement, attorney-client
                relationship, or guarantee future work.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-soft-lg">
              {submitError && (
                <p className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  {submitError}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                Full name <span className="text-primary-600">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 font-medium shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                placeholder="Dr. Jane Smith"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-slate-700">
                Phone number <span className="text-primary-600">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 font-medium shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                Email <span className="text-primary-600">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 font-medium shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
                placeholder="jane.smith@example.com"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="cv" className="block text-sm font-bold text-slate-700">
                CV / Resume <span className="text-primary-600">*</span>
              </label>
              <p className="mt-0.5 text-xs text-slate-500 font-medium">
                PDF or Word, max {MAX_FILE_SIZE_MB} MB
              </p>
              <input
                id="cv"
                name="cv"
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileChange}
                className="mt-2 block w-full text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-primary-700 hover:file:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-0 rounded-xl border border-slate-300 bg-white transition-all"
              />
              {form.cv && (
                <p className="mt-1.5 text-sm text-slate-600 font-medium">{form.cv.name}</p>
              )}
              {errors.cv && (
                <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.cv}</p>
              )}
            </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-8 rounded-xl bg-primary-600 px-4 py-4 font-bold text-white shadow-soft-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
