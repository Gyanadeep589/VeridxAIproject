const audiences = [
  'Med-Legal and litigation support teams',
  'Insurance and claims organizations',
  'Independent medical review entities',
  'Oversight, compliance, and quality assurance groups',
]

export default function WhoWeWorkWith() {
  return (
    <section id="who-we-work-with" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <span className="section-label">Partners</span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-medical-navy">
          Who We Work With
        </h2>
        <p className="mt-6 text-slate-600 text-lg sm:text-xl leading-relaxed">
          VeriDx.ai supports organizations where medical evidence quality directly impacts risk and
          outcomes, including:
        </p>
        <ul className="mt-10 space-y-4">
          {audiences.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-4 p-4 sm:p-5 rounded-xl bg-medical-mist border border-slate-200/60 hover:border-primary-200 hover:bg-primary-50/30 transition-all"
            >
              <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary-600" />
              <span className="text-slate-700 text-base sm:text-lg font-medium">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 p-5 rounded-xl bg-primary-50 border border-primary-100 text-slate-700 text-base sm:text-lg italic font-medium">
          Engagements are selective and use-case driven.
        </p>
      </div>
    </section>
  )
}
