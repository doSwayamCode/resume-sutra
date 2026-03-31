
import { Link } from "react-router-dom";
// ...existing code...

const coreTemplates = [
  {
    key: "jake",
    title: "Jake Resume",
    badge: "Primary",
    image: "/templates/jake.svg",
    description: "Single-column, compact, text-only placement-focused template.",
  },
  {
    key: "classic-logo",
    title: "Classic With Logo",
    badge: "Active",
    image: "/templates/classic-logo.svg",
    description: "Institution-style layout with optional logo and compact section separators.",
  },
  {
    key: "table-edu",
    title: "Table Education Format",
    badge: "Active",
    image: "/templates/table-edu.svg",
    description: "Structured education table with ATS-safe typography and clear chronology.",
  },
  {
    key: "modern-clean",
    title: "Modern Minimal",
    badge: "Active",
    image: "/templates/modern-clean.svg",
    description: "Creator-inspired clean hierarchy with tight bullets and strong readability.",
  },
] as const;

const indiaCampusTemplates = [
  {
    key: "dtu-placement",
    title: "DTU Placement Style",
    image: "/templates/dtu-placement.svg",
    description: "Engineering placement layout with concise project-first storytelling.",
    referenceUrl: "https://www.overleaf.com/latex/templates/dtu-sample-resume/mgtzfqwrsbxx",
    referenceLabel: "Public reference",
  },
  {
    key: "nsut-placement",
    title: "NSUT Placement Style",
    image: "/templates/nsut-placement.svg",
    description: "ATS-safe NSUT-inspired format with compact impact bullets.",
    referenceUrl: "https://www.overleaf.com/latex/templates/nsut-tnp-resume/sxzbtkwmqsyg",
    referenceLabel: "Public reference",
  },
  {
    key: "iit-placement",
    title: "IIT Placement Style",
    image: "/templates/iit-placement.svg",
    description: "Research + impact balanced structure preferred in top technical hiring.",
    referenceUrl: "https://www.overleaf.com/latex/templates/iit-bombay-resume-template-2021/fndpyhthjqpm",
    referenceLabel: "Public reference",
  },
  {
    key: "nit-placement",
    title: "NIT Placement Style",
    image: "/templates/nit-placement.svg",
    description: "Section-first placement format tuned for intern and fresher roles.",
    referenceUrl: "https://www.overleaf.com/latex/templates/nit-warangal-resume/gtsrbjvffcjn",
    referenceLabel: "Public reference",
  },
  {
    key: "iiit-placement",
    title: "IIIT Placement Style",
    image: "/templates/iiit-placement.svg",
    description: "IIIT-inspired technical layout with concise impact bullets and compact spacing.",
    referenceUrl: "https://www.overleaf.com/latex/templates/iiit-guwahati-resume/xxdbvsypzbqw",
    referenceLabel: "Public reference",
  },
  {
    key: "iisc-academic",
    title: "IISc Academic Style",
    image: "/templates/iisc-academic.svg",
    description: "Research-oriented academic one-pager with publications-ready section hierarchy.",
    referenceUrl: "https://www.overleaf.com/latex/templates/modern-simple-cv/kwrxbwthgrwr",
    referenceLabel: "Public academic template",
  },
  {
    key: "igdtuw-placement",
    title: "IGDTUW Placement Style",
    image: "/templates/igdtuw-placement.svg",
    description: "Campus placement oriented format with clear metrics and readability.",
    referenceUrl: "https://www.overleaf.com/latex/templates/ats-friendly-technical-resume/yrhtcnjyzgsf",
    referenceLabel: "Public template",
  },
  {
    key: "bits-placement",
    title: "BITS Placement Style",
    image: "/templates/bits-placement.svg",
    description: "Strong project and skill hierarchy inspired by BITS placement norms.",
    referenceUrl: "https://www.overleaf.com/latex/templates/elegant-resume/nwjbrwykcwjx",
    referenceLabel: "Public template",
  },
  {
    key: "iim-management",
    title: "IIM Management Style",
    image: "/templates/iim-management.svg",
    description: "Management-focused one-pager with achievement and leadership emphasis.",
    referenceUrl: "https://www.overleaf.com/latex/templates/resume-template-by-orest/zmrmcnwmxdxn",
    referenceLabel: "Public template",
  },
  {
    key: "ggsipu-placement",
    title: "GGSIPU Placement Style",
    image: "/templates/ggsipu-placement.svg",
    description: "IPU-aligned student format with strong structure for internships and placements.",
    referenceUrl: "https://www.overleaf.com/latex/templates/ggsipu-cv-template/xvcypypsdrqz",
    referenceLabel: "Public reference",
  },
  {
    key: "ca-professional",
    title: "CA Professional Style",
    image: "/templates/ca-professional.svg",
    description: "Chartered Accountant style with audit, compliance, and article-ship emphasis.",
    referenceUrl: "https://www.overleaf.com/latex/templates/one-row-academic-cv/kknxzfcnthjk",
    referenceLabel: "Public template",
  },
] as const;

function Home() {
  return (
    <>
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

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Core Templates</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Up to the mark</span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {coreTemplates.map((template) => (
                <article
                  key={template.key}
                  className="app-glass overflow-hidden rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <img src={template.image} alt={`${template.title} template preview`} className="h-56 w-full object-cover" />
                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">{template.title}</h3>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{template.badge}</span>
                    </div>
                    <p className="text-sm text-slate-600">{template.description}</p>
                    <Link
                      to={`/builder?template=${template.key}&fresh=1`}
                      className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Use This Template
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">India Campus Inspired Templates</h2>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">New</span>
            </div>
            <p className="text-sm text-slate-600">
              Crafted from common public placement-format patterns shared by students and communities. These are clean, ATS-safe, copyright-clean
              reinterpretations to help students learn structure quickly.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {indiaCampusTemplates.map((template) => (
                <article
                  key={template.key}
                  className="app-glass overflow-hidden rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <img src={template.image} alt={`${template.title} template preview`} className="h-56 w-full object-cover" />
                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-900">{template.title}</h3>
                      <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">Campus</span>
                    </div>
                    <p className="text-sm text-slate-600">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/builder?template=${template.key}&fresh=1`}
                        className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Use This Template
                      </Link>
                      <a
                        href={template.referenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        {template.referenceLabel}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* View Counter */}
          <div className="mt-10 flex flex-col items-center justify-center">
              {/* hitwebcounter Code START */}
              <a href="https://www.hitwebcounter.com/" target="_blank">
                <img src="https://hitwebcounter.com/counter/counter.php?page=21486236&style=0005&nbdigits=6&type=page&initCount=72" title="Free Tools" alt="Free Tools" border="0" />
              </a>
            <div className="mt-2 text-sm text-slate-500">
              Made with <span className="text-pink-500">♥</span> by{' '}
              <a
                href="https://www.linkedin.com/in/swayam-gupta0708/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                Swayam
              </a>
            </div>
          </div>
        </div>
      </main>
    // ...existing code...
    </>
  );
}

export default Home;
