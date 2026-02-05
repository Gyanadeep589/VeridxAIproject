const approachPoints = [
  'Bring clarity to complex and fragmented medical records',
  'Surface signals related to documentation quality, consistency, and support',
  'Enable more defensible review decisions before issues escalate',
  'Augment expert judgment with structured insight',
]

export default function Approach() {
  return (
    <section id="approach" className="py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <span className="section-label">How We Help</span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-medical-navy">
          Our Approach
        </h2>
        <p className="mt-6 text-slate-600 text-lg sm:text-xl leading-relaxed">
          VeriDx.ai applies advanced document intelligence to support early, structured understanding of
          medical malpractice documents.
        </p>
        <p className="mt-4 text-slate-600 text-lg leading-relaxed">
          At a high level, the platform is designed to:
        </p>
        <ul className="mt-10 space-y-4">
          {approachPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                {i + 1}
              </span>
              <span className="text-slate-700 text-base sm:text-lg font-medium pt-1.5">{point}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-primary-950 text-primary-50 border border-primary-800">
          <p className="text-base sm:text-lg leading-relaxed italic">
            The objective is risk awareness and prevention, not diagnosis or legal judgment.
          </p>
        </div>
      </div>
    </section>
  )
}
