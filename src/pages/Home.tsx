import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-8 sm:space-y-10">
        <header className="flex items-center justify-center">
          <img
            src="/resumesutra-logo.svg"
            alt="ResumeSutra logo"
            className="h-auto w-full max-w-[250px] object-contain sm:max-w-[300px] md:max-w-[360px]"
          />
        </header>

        <section className="mx-auto max-w-4xl px-1 text-center sm:px-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Choose a Resume Format, Then Build It Line by Line
          </h1>
          <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:mt-4 sm:text-lg sm:leading-8">
            ATS-friendly templates, live preview, AI bullet improvement, JD match scoring, and one-click PDF export.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article className="app-glass overflow-hidden rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-xl">
            <img src="/templates/jake.svg" alt="Jake resume template preview" className="h-56 w-full object-cover" />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Jake Resume</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Primary</span>
              </div>
              <p className="text-sm text-slate-600">Single-column, compact, text-only placement-focused template.</p>
              <Link
                to="/builder?template=jake"
                className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Use This Template
              </Link>
            </div>
          </article>

          <article className="app-glass overflow-hidden rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-xl">
            <img src="/templates/classic-logo.svg" alt="Classic logo resume template preview" className="h-56 w-full object-cover" />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Classic With Logo</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
              </div>
              <p className="text-sm text-slate-600">Institution-style layout with optional logo and compact section separators.</p>
              <Link
                to="/builder?template=classic-logo"
                className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Use This Template
              </Link>
            </div>
          </article>

          <article className="app-glass overflow-hidden rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-xl">
            <img src="/templates/table-edu.svg" alt="Table education resume template preview" className="h-56 w-full object-cover" />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Table Education Format</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
              </div>
              <p className="text-sm text-slate-600">Structured education table with ATS-safe typography and clear chronology.</p>
              <Link
                to="/builder?template=table-edu"
                className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Use This Template
              </Link>
            </div>
          </article>

          <article className="app-glass overflow-hidden rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-xl md:col-span-2 xl:col-span-1">
            <img src="/templates/modern-clean.svg" alt="Modern clean resume template preview" className="h-56 w-full object-cover" />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Modern Minimal</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Active</span>
              </div>
              <p className="text-sm text-slate-600">Creator-inspired clean hierarchy with tight bullets and strong readability.</p>
              <Link
                to="/builder?template=modern-clean"
                className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Use This Template
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default Home;
