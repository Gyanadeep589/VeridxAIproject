import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../Images/logo.jpeg'

const navLinks = [
  { label: 'The Challenge', href: '/#challenge' },
  { label: 'Our Approach', href: '/#approach' },
  { label: 'Value', href: '/#value' },
  { label: 'Who We Work With', href: '/#who-we-work-with' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const isIntakePage = location.pathname === '/expert-intake'
  const isSubmissionsPage = location.pathname === '/submissions'

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-soft">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            onClick={handleLogoClick}
            className="font-display font-bold text-xl text-medical-navy tracking-tight flex items-center gap-1.5"
          >
            <span className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <img src={logo} alt="VeriDx.ai" className="w-full h-full" />
            </span>
            <span>VeriDx<span className="text-primary-600">.ai</span></span>
            </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                {link.label === 'Contact' ? (
                  <Link
                    to="/expert-intake"
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isIntakePage
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50/80'
                    }`}
                  >
                    Expert Intake
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 text-sm font-semibold transition-all"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}

            {/* Submissions BEFORE Contact */}
            <li>
              <Link
                to="/submissions"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isSubmissionsPage
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50/80'
                }`}
              >
                Submissions
              </Link>
            </li>

            <li>
              <a
                href="/#contact"
                className="px-4 py-2 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-primary-50/80 text-sm font-semibold transition-all"
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-5 border-t border-slate-200/80 bg-medical-mist/50 -mx-4 px-4 rounded-b-2xl">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {link.label === 'Contact' ? (
                    <Link
                      to="/expert-intake"
                      onClick={() => setOpen(false)}
                      className={`block py-3 px-4 rounded-xl font-semibold ${
                        isIntakePage
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-slate-700 hover:bg-primary-50'
                      }`}
                    >
                      Expert Intake
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 px-4 rounded-xl text-slate-700 hover:bg-primary-50 font-semibold"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}

              {/* Submissions BEFORE Contact */}
              <li>
                <Link
                  to="/submissions"
                  onClick={() => setOpen(false)}
                  className={`block py-3 px-4 rounded-xl font-semibold ${
                    isSubmissionsPage
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-700 hover:bg-primary-50'
                  }`}
                >
                  Submissions
                </Link>
              </li>

              <li>
                <a
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-xl text-slate-700 hover:bg-primary-50 font-semibold"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}