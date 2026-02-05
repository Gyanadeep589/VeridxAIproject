const points = [
  'Not understanding the crux of the case',
  'Increased malpractice exposure',
  'Wasting time and money on the wrong experts',
  'Escalating claims and settlement costs',
]

export default function Challenge() {
  return (
    <section id="challenge" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-medical-mist bg-grid-pattern">
      <div className="max-w-4xl mx-auto">
        <span className="section-label">The Problem</span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-medical-navy">
          The Challenge
        </h2>
        <p className="mt-6 text-slate-600 text-lg sm:text-xl leading-relaxed">
          Medical records are foundational to legal, insurance, and regulatory decisions.
          When documentation is incomplete, inconsistent, or poorly understood, it can lead to:
        </p>
        <ul className="mt-10 space-y-5">
          {points.map((point, i) => (
            <li key={i} className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:border-primary-200 hover:shadow-soft-lg transition-all duration-200">
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                {i + 1}
              </span>
              <span className="text-slate-700 text-base sm:text-lg font-medium pt-1.5">{point}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 p-5 sm:p-6 rounded-2xl bg-primary-50/80 border border-primary-100 text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
          As case volumes grow, manual review alone struggles to surface these risks early enough.
        </p>
      </div>
    </section>
  )
}
