export default function Contact() {
  return (
    <section id="contact" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-medical-mist bg-grid-pattern">
      <div className="max-w-2xl mx-auto text-center">
        <span className="section-label">Get in Touch</span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-medical-navy">
          Contact
        </h2>
        <p className="mt-6 text-slate-600 text-lg">
          For confidential discussions:
        </p>
        <a
          href="mailto:hello@veridx.ai"
          className="mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary-600 text-white font-bold shadow-soft-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-glow transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          hello@veridx.ai
        </a>
      </div>
    </section>
  )
}
