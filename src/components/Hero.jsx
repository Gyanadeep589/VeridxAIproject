export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-slate-50" aria-hidden="true" />
      <div className="absolute inset-0 bg-dots-pattern opacity-30" aria-hidden="true" />
      <div className="absolute -top-24 right-[-10%] w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-[-10%] w-72 h-72 bg-primary-100/40 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto w-full lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center gap-10 lg:gap-14">
        {/* Left: main message */}
        <div className="w-full text-center lg:text-left">
          <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-slate-200/70 shadow-soft text-xs font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-primary-600" />
              AI-Powered Medical Intelligence
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50/80 border border-primary-100 text-xs font-bold text-primary-800">
              Founded by physicians + technical experts
            </span>
          </div>

          <h1 className="mt-8 font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl text-medical-navy tracking-tight leading-tight">
            <span className="block">VeriDx<span className="text-primary-600">.ai</span></span>
            <span
              className="mt-2 inline-block align-baseline text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl
                         font-extrabold tracking-tight whitespace-nowrap
                         leading-snug pb-1
                         bg-clip-text text-transparent
                         bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500"
            >
              The Truth, Diagnosed
            </span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-slate-700 font-semibold max-w-2xl mx-auto lg:mx-0">
            AI-Powered intelligence for medical malpractice—turning complex, fragmented records into structured case insight.
          </p>

          <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-slate-600 text-base sm:text-lg leading-relaxed">
            Designed to bring clarity to complex medical records, highlight documentation risk, and support more defensible review decisions before issues escalate.
          </p>

          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
            <a
              href="#challenge"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary-600 text-white font-bold shadow-soft-lg shadow-primary-600/20 hover:bg-primary-700 hover:shadow-glow transition-all duration-200"
            >
              Explore the Challenge
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="/expert-intake"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-primary-200 text-primary-800 font-bold hover:border-primary-400 hover:bg-primary-50 transition-all duration-200"
            >
              Expert intake
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-7 py-3.5 rounded-xl border-2 border-slate-300 text-slate-700 font-bold hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50/50 transition-all duration-200"
            >
              Contact
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500">
            <span>Med-legal · Insurance · Independent review · Oversight</span>
            <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-slate-500">Structured, case-ready insight—not diagnosis.</span>
          </div>
        </div>

        {/* Right: advanced summary card */}
        <div className="mt-10 lg:mt-0">
          <div className="relative mx-auto max-w-sm rounded-3xl bg-white/80 backdrop-blur border border-slate-200/80 shadow-soft-lg overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600" />
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Case overview
                  </p>
                  <p className="mt-1 text-sm font-semibold text-medical-navy">
                    Documentation integrity snapshot
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold text-primary-700">
                  <span className="h-2 w-2 rounded-full bg-primary-500" />
                  Early review
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Record coherence</p>
                    <p className="text-xs text-slate-500">
                      Key encounters and timelines aligned; no major gaps detected.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Documentation risk signals</p>
                    <p className="text-xs text-slate-500">
                      3 areas flagged for inconsistent charting and missing follow-up notes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700">Expert review focus</p>
                    <p className="text-xs text-slate-500">
                      Suggested focus on ED triage, handoff documentation, and discharge instructions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-500">
                <span>Structured from thousands of record pages</span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  <span>Signal, not judgment</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
