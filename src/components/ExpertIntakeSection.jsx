import { Link } from 'react-router-dom'

export default function ExpertIntakeSection() {
  return (
    <section id="expert-intake" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <span className="section-label">Join Our Network</span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-medical-navy">
          Medical Expert Intake
        </h2>
        <p className="mt-6 text-slate-600 text-lg sm:text-xl leading-relaxed">
          Are you a medical expert interested in working with VeriDx.ai? Submit your name, contact details, and CV to get started.
        </p>
        <Link
          to="/expert-intake"
          className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-bold shadow-soft-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-glow transition-all duration-200"
        >
          Start intake
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
