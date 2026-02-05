import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-medical-navy text-slate-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link to="/" className="font-display font-bold text-xl text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </span>
          VeriDx<span className="text-primary-400">.ai</span>
        </Link>
        <p className="text-sm text-slate-400 text-center sm:text-left max-w-md">
          The Truth, Diagnosed — AI-Powered Intelligence for Medical Malpractice
        </p>
        <a
          href="mailto:hello@veridx.ai"
          className="text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
        >
          hello@veridx.ai
        </a>
      </div>
    </footer>
  )
}
