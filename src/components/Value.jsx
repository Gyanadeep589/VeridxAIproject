const valueCards = [
  {
    title: 'Risk & Liability Awareness',
    description: 'Identify documentation patterns and gaps that may increase downstream exposure — early in the review lifecycle.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Stronger Defensibility',
    description: 'Support decisions with consistent, structured evidence review that holds up under scrutiny.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
  },
  {
    title: 'Higher Documentation Integrity',
    description: 'Improve confidence in the completeness, coherence, and supportability of medical records used in decisions.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Consistency at Scale',
    description: 'Apply uniform analytical rigor across cases, reducing variability that often fuels disputes.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
]

export default function Value() {
  return (
    <section id="value" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-primary-50/50">
      <div className="max-w-6xl mx-auto">
        <span className="section-label">What We Deliver</span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-medical-navy">
          The Value We Create
        </h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {valueCards.map((card, i) => (
            <div
              key={i}
              className="group p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-600 text-white flex items-center justify-center group-hover:bg-primary-700 transition-colors">
                {card.icon}
              </div>
              <h3 className="mt-5 font-display font-bold text-lg text-medical-navy">
                {card.title}
              </h3>
              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
