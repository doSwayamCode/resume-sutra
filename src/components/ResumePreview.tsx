import { CSSProperties, ReactNode, forwardRef } from "react";
import { ResumeData, ResumeFontStyle, ResumeTemplate } from "../store/useResumeStore";

type ResumePreviewProps = {
  data: ResumeData;
  template: ResumeTemplate;
  layout: {
    fontSize: number;
    lineHeight: number;
    sectionGap: number;
    itemGap: number;
    fontStyle?: ResumeFontStyle;
  };
};

type SectionKey =
  | "summary"
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "achievements"
  | "positions"
  | "certifications"
  | "caArticleship"
  | "caAudit"
  | "caTax"
  | "caTools";

const DEFAULT_SECTION_TITLES: Record<SectionKey, string> = {
  summary: "SUMMARY",
  education: "EDUCATION",
  experience: "EXPERIENCE",
  projects: "PROJECTS",
  skills: "SKILLS",
  achievements: "ACHIEVEMENTS",
  positions: "POSITIONS OF RESPONSIBILITY",
  certifications: "CERTIFICATIONS",
  caArticleship: "ARTICLESHIP",
  caAudit: "AUDIT / ASSURANCE ASSIGNMENTS",
  caTax: "TAXATION & COMPLIANCE",
  caTools: "ACCOUNTING TOOLS",
};

const FONT_STYLE_STACK: Record<ResumeFontStyle, string> = {
  latex: '"Latin Modern Roman", "Computer Modern Serif", "STIX Two Text", "Times New Roman", serif',
  classic: '"EB Garamond", "Garamond", "Georgia", "Times New Roman", serif',
  modern: '"Source Serif 4", "Cambria", "Palatino Linotype", serif',
  "serif-pro": '"STIX Two Text", "Source Serif 4", "Times New Roman", serif',
  executive: '"Merriweather", "Cambria", "Georgia", serif',
  "clean-sans": '"IBM Plex Sans", "Segoe UI", "Calibri", sans-serif',
};

const TEMPLATE_SECTION_ORDER: Record<ResumeTemplate, SectionKey[]> = {
  jake: ["education", "experience", "projects", "skills", "achievements"],
  "classic-logo": ["summary", "education", "experience", "projects", "skills", "achievements"],
  "table-edu": ["education", "summary", "experience", "projects", "skills", "achievements"],
  "modern-clean": ["experience", "projects", "skills", "education", "achievements"],
  "dtu-placement": ["education", "experience", "projects", "positions", "certifications", "skills", "achievements"],
  "nsut-placement": ["education", "experience", "projects", "positions", "achievements", "skills"],
  "iit-placement": ["education", "projects", "skills", "experience", "positions", "achievements"],
  "nit-placement": ["education", "experience", "projects", "skills", "positions", "achievements"],
  "iiit-placement": ["education", "experience", "projects", "skills", "positions", "achievements"],
  "iisc-academic": ["summary", "education", "projects", "experience", "skills", "achievements"],
  "igdtuw-placement": ["education", "experience", "projects", "skills", "certifications", "positions", "achievements"],
  "bits-placement": ["education", "experience", "projects", "positions", "achievements", "skills"],
  "iim-management": ["summary", "experience", "skills", "education", "achievements", "certifications"],
  "ggsipu-placement": ["education", "experience", "projects", "skills", "certifications", "positions", "achievements"],
  "ca-professional": [
    "summary",
    "skills",
    "caArticleship",
    "caAudit",
    "caTax",
    "experience",
    "projects",
    "caTools",
    "certifications",
    "education",
    "achievements",
  ],
};

const TEMPLATE_SECTION_TITLES: Partial<Record<ResumeTemplate, Partial<Record<SectionKey, string>>>> = {
  "iisc-academic": {
    projects: "RESEARCH / PROJECTS",
    achievements: "PUBLICATIONS / AWARDS",
  },
  "dtu-placement": {
    experience: "INTERNSHIPS AND WORK EXPERIENCE",
    achievements: "EXTRA CURRICULAR ACTIVITIES AND ACHIEVEMENTS",
    certifications: "COURSES AND CERTIFICATIONS",
  },
  "nsut-placement": {
    experience: "INTERNSHIP",
    achievements: "ACADEMIC ACHIEVEMENTS",
    skills: "OTHER INFORMATION",
  },
  "iit-placement": {
    projects: "B.TECH THESIS & SEMINAR / COURSE PROJECTS",
    experience: "WORK EXPERIENCE & INTERNSHIPS",
    achievements: "POR & EXTRA-CURRICULARS",
  },
  "nit-placement": {
    projects: "PERSONAL PROJECTS",
    skills: "TECHNICAL SKILLS AND INTERESTS",
  },
  "iiit-placement": {
    projects: "PERSONAL PROJECTS",
    skills: "TECHNICAL SKILLS AND INTERESTS",
  },
  "ca-professional": {
    experience: "ARTICLESHIP / AUDIT EXPERIENCE",
    achievements: "CERTIFICATIONS / COMPLIANCE",
    projects: "WORK EXPERIENCE",
    certifications: "TRAININGS",
  },
  "iim-management": {
    achievements: "LEADERSHIP / ACHIEVEMENTS",
    projects: "LIVE PROJECTS / CASEWORK",
  },
  "table-edu": {
    achievements: "MISCELLANEOUS",
    skills: "TECHNICAL SKILLS",
  },
};

type TemplateHeaderMode = "modern-left" | "logo-left" | "centered" | "academic-split";

const TEMPLATE_HEADER_MODE: Record<ResumeTemplate, TemplateHeaderMode> = {
  jake: "centered",
  "classic-logo": "logo-left",
  "table-edu": "logo-left",
  "modern-clean": "modern-left",
  "dtu-placement": "logo-left",
  "nsut-placement": "logo-left",
  "iit-placement": "logo-left",
  "nit-placement": "logo-left",
  "iiit-placement": "logo-left",
  "iisc-academic": "logo-left",
  "igdtuw-placement": "logo-left",
  "bits-placement": "logo-left",
  "iim-management": "logo-left",
  "ggsipu-placement": "logo-left",
  "ca-professional": "academic-split",
};

const STRICT_STRUCTURE_TEMPLATES = new Set<ResumeTemplate>([
  "dtu-placement",
  "nsut-placement",
  "iit-placement",
  "nit-placement",
  "iiit-placement",
  "iisc-academic",
  "igdtuw-placement",
  "bits-placement",
  "iim-management",
  "ggsipu-placement",
  "ca-professional",
]);

const FORCE_INSTITUTE_LOGO_TEMPLATES = new Set<ResumeTemplate>([
  "dtu-placement",
  "nsut-placement",
  "iit-placement",
  "nit-placement",
  "iiit-placement",
  "iisc-academic",
  "igdtuw-placement",
  "bits-placement",
  "iim-management",
  "ggsipu-placement",
]);

const TABLE_EDUCATION_TEMPLATES = new Set<ResumeTemplate>([
  "table-edu",
  "dtu-placement",
  "nsut-placement",
  "iit-placement",
  "ggsipu-placement",
]);

const TEMPLATE_CONTACT_SEPARATOR: Partial<Record<ResumeTemplate, string>> = {
  "dtu-placement": "  |  ",
  "nsut-placement": "  |  ",
  "iit-placement": "  |  ",
  "nit-placement": "  |  ",
  "iiit-placement": "  |  ",
  "ggsipu-placement": "  |  ",
  "iisc-academic": "  |  ",
};

const TEMPLATE_ROLE_COMPANY_JOINER: Partial<Record<ResumeTemplate, string>> = {
  "iisc-academic": "  |  ",
  "iim-management": "  |  ",
  "ca-professional": "  |  ",
};

const TEMPLATE_PROJECT_TECH_JOINER: Partial<Record<ResumeTemplate, string>> = {
  "iisc-academic": "  |  ",
  "iim-management": "  |  ",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const numericTokenPattern = /(\d+(?:[.,:/-]\d+)*%?)/g;

function normalizeUrl(rawValue: string): string | null {
  const value = rawValue.trim();
  if (!value) return null;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    return /^https?:$/i.test(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function isGithubUrl(urlValue: string): boolean {
  try {
    return new URL(urlValue).hostname.toLowerCase().includes("github.com");
  } catch {
    return false;
  }
}

function isLikelyPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function toHref(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (emailPattern.test(trimmed)) return `mailto:${trimmed}`;
  if (isLikelyPhone(trimmed)) return `tel:${trimmed.replace(/[^\d+]/g, "")}`;
  if (/^https?:\/\//i.test(trimmed) || /^(www\.)?[\w-]+(\.[\w-]+)+([/?#].*)?$/i.test(trimmed)) {
    return normalizeUrl(trimmed);
  }

  return null;
}

function extractProjectUrls(value: string): string[] {
  const matches = value.match(/https?:\/\/[^\s|,]+|(?:www\.)?[\w-]+(\.[\w-]+)+([^\s|,]*)/gi) ?? [];
  const uniqueUrls = new Set<string>();
  matches.forEach((match) => {
    const normalized = normalizeUrl(match);
    if (normalized) uniqueUrls.add(normalized);
  });
  return Array.from(uniqueUrls);
}

function renderNumbers(value: string): ReactNode {
  const parts = value.split(numericTokenPattern);
  if (parts.length <= 1) return value;

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <strong key={`num-${index}`} style={{ fontWeight: 700 }}>
        {part}
      </strong>
    ) : (
      <span key={`txt-${index}`}>{part}</span>
    ),
  );
}

function renderTextWithBoldNumbers(value: string, options?: { highlightNumbers?: boolean; linkify?: boolean }): ReactNode {
  const highlightNumbers = options?.highlightNumbers ?? true;
  const linkify = options?.linkify ?? true;
  if (!value) return value;

  if (!linkify) {
    return highlightNumbers ? renderNumbers(value) : value;
  }

  const tokenPattern = /((?:https?:\/\/|www\.)[^\s]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/gi;
  const fragments: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let linkIndex = 0;

  while ((match = tokenPattern.exec(value)) !== null) {
    const start = match.index;
    const token = match[0];

    if (start > lastIndex) {
      const textPart = value.slice(lastIndex, start);
      fragments.push(
        <span key={`text-${lastIndex}`}>{highlightNumbers ? renderNumbers(textPart) : textPart}</span>,
      );
    }

    const href = toHref(token);
    if (href) {
      fragments.push(
        <a
          key={`link-${linkIndex}`}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="no-underline"
          style={{ color: "inherit" }}
        >
          {token}
        </a>,
      );
      linkIndex += 1;
    } else {
      fragments.push(
        <span key={`text-token-${start}`}>{highlightNumbers ? renderNumbers(token) : token}</span>,
      );
    }

    lastIndex = start + token.length;
  }

  if (lastIndex < value.length) {
    const tail = value.slice(lastIndex);
    fragments.push(
      <span key={`tail-${lastIndex}`}>{highlightNumbers ? renderNumbers(tail) : tail}</span>,
    );
  }

  return fragments.length > 0 ? fragments : highlightNumbers ? renderNumbers(value) : value;
}

function renderLinkLikeText(value: string, options?: { highlightNumbers?: boolean }): ReactNode {
  const href = toHref(value);
  const highlightNumbers = options?.highlightNumbers ?? false;
  if (!href) return renderTextWithBoldNumbers(value, { highlightNumbers, linkify: true });

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="no-underline"
      style={{ color: "inherit" }}
    >
      {renderTextWithBoldNumbers(value, { highlightNumbers: false, linkify: false })}
    </a>
  );
}

function simplifyLinkLabel(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "");
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    return `${host}${path}`;
  } catch {
    return url;
  }
}

function renderProjectLinks(value: string): ReactNode {
  const urls = extractProjectUrls(value);
  if (urls.length === 0) return renderTextWithBoldNumbers(value);

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {urls.map((url, index) => {
        const github = isGithubUrl(url);
        return (
          <span key={`${url}-${index}`} className="inline-flex items-center gap-1">
            {index > 0 ? <span>|</span> : null}
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={github ? "Open GitHub project link" : "Open live project link"}
              className="inline-flex items-center gap-1 no-underline"
              style={{ color: "inherit" }}
            >
              {github ? (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.62-4.04-1.62-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.64.24 2.86.12 3.16.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.3c0 .32.22.69.83.58A12 12 0 0 0 12 .5Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm6.93 9h-3.01a15.6 15.6 0 0 0-1.1-4.35A8.05 8.05 0 0 1 18.93 11ZM12 4.05c.74.95 1.74 3.12 1.93 6.95h-3.86C10.26 7.17 11.26 5 12 4.05ZM9.18 6.65A15.6 15.6 0 0 0 8.08 11H5.07a8.05 8.05 0 0 1 4.11-4.35ZM4.26 13h3.82a15.93 15.93 0 0 0 1.1 4.35A8.05 8.05 0 0 1 4.26 13ZM12 19.95c-.74-.95-1.74-3.12-1.93-6.95h3.86c-.19 3.83-1.19 6-1.93 6.95Zm2.82-2.6A15.93 15.93 0 0 0 15.92 13h3.82a8.05 8.05 0 0 1-4.92 4.35Z" />
                </svg>
              )}
              <span>{simplifyLinkLabel(url)}</span>
            </a>
          </span>
        );
      })}
    </span>
  );
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, template, layout }, ref) => {
  const headerMode = TEMPLATE_HEADER_MODE[template] ?? "centered";
  const tableTemplate = TABLE_EDUCATION_TEMPLATES.has(template);
  const legacyTableTemplate = template === "table-edu";
  const strictTemplate = STRICT_STRUCTURE_TEMPLATES.has(template);
  const forceInstituteLogo = FORCE_INSTITUTE_LOGO_TEMPLATES.has(template);
  const contactSeparator = TEMPLATE_CONTACT_SEPARATOR[template] ?? "  •  ";
  const roleCompanyJoiner = TEMPLATE_ROLE_COMPANY_JOINER[template] ?? "  -  ";
  const projectTechJoiner = TEMPLATE_PROJECT_TECH_JOINER[template] ?? "  -  ";

  const hasAnyContent = Boolean(
    data.name.trim() ||
      data.email.trim() ||
      data.phone.trim() ||
      data.location.trim() ||
      data.links.trim() ||
      data.education.length ||
      data.experience.length ||
      data.projects.length ||
      data.skills.length ||
      data.certifications.length ||
      data.positions.length ||
      data.caArticleship.length ||
      data.caAuditExperience.length ||
      data.caTaxationAndCompliance.length ||
      data.caTools.length ||
      data.achievements.some((item) => item.title || item.details),
  );

  const contactPrimary = [data.location, data.email, data.phone].filter(Boolean);
  const contactLinks = data.links
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  const contactPrimaryDisplay =
    contactPrimary.length > 0
      ? contactPrimary
      : strictTemplate
        ? ["City", "email@domain.com", "+91-XXXXXXXXXX"]
        : [];

  const renderContactLine = () => (
    <div className="contact-block">
      {contactPrimaryDisplay.length > 0 && (
        <p className="contact">
          {contactPrimaryDisplay.map((item, index) => (
            <span key={`primary-${item}-${index}`}>
              {index > 0 ? contactSeparator : ""}
              {renderLinkLikeText(item, { highlightNumbers: false })}
            </span>
          ))}
        </p>
      )}
      {contactLinks.length > 0 && (
        <p className="contact contact-links">
          {contactLinks.map((item, index) => (
            <span key={`link-${item}-${index}`}>
              {index > 0 ? contactSeparator : ""}
              {renderLinkLikeText(item, { highlightNumbers: false })}
            </span>
          ))}
        </p>
      )}
    </div>
  );

  const resolveSectionTitle = (key: SectionKey, fallback: string) => {
    return TEMPLATE_SECTION_TITLES[template]?.[key] ?? fallback;
  };

  const renderSummarySection = () =>
    data.summary.trim() ? (
      <section key="summary">
        <h2>{resolveSectionTitle("summary", DEFAULT_SECTION_TITLES.summary)}</h2>
        <div className="item">
          <p className="detail-line">{renderTextWithBoldNumbers(data.summary)}</p>
        </div>
      </section>
    ) : null;

  const renderEducationSection = () =>
    tableTemplate && template !== "table-edu"
      ? null
      :
    data.education.length > 0 ? (
      <section key="education">
        <h2>{resolveSectionTitle("education", DEFAULT_SECTION_TITLES.education)}</h2>
        {data.education.map((item) => (
          <div className="item" key={item.id}>
            <div className="row">
              <span className="title">{renderTextWithBoldNumbers(item.school)}</span>
              <span className="date">{renderTextWithBoldNumbers([item.startDate, item.endDate].filter(Boolean).join("-"))}</span>
            </div>
            {item.degree && <p className="meta-line">{renderTextWithBoldNumbers(item.degree)}</p>}
            {item.details && <p className="detail-line">{renderTextWithBoldNumbers(item.details)}</p>}
          </div>
        ))}
      </section>
    ) : null;

  const renderExperienceSection = () =>
    data.experience.length > 0 ? (
      <section key="experience">
        <h2>{resolveSectionTitle("experience", DEFAULT_SECTION_TITLES.experience)}</h2>
        {data.experience.map((item) => (
          <div className="item" key={item.id}>
            <div className="row">
              <span className="title">{renderTextWithBoldNumbers([item.role, item.company].filter(Boolean).join(roleCompanyJoiner))}</span>
              <span className="date">{renderTextWithBoldNumbers([item.startDate, item.endDate].filter(Boolean).join("-"))}</span>
            </div>
            {item.bullets.filter(Boolean).length > 0 && (
              <ul>
                {item.bullets.filter(Boolean).slice(0, 4).map((bullet, bulletIndex) => (
                  <li key={`${item.id}-${bulletIndex}`}>{renderTextWithBoldNumbers(bullet)}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    ) : null;

  const renderProjectsSection = () =>
    data.projects.length > 0 ? (
      <section key="projects">
        <h2>{resolveSectionTitle("projects", DEFAULT_SECTION_TITLES.projects)}</h2>
        {data.projects.map((item) => (
          <div className="item" key={item.id}>
            <div className="row">
              <span className="title">{renderTextWithBoldNumbers([item.name, item.tech].filter(Boolean).join(projectTechJoiner))}</span>
              <span className="date">{renderProjectLinks(item.link)}</span>
            </div>
            {item.bullets.filter(Boolean).length > 0 && (
              <ul>
                {item.bullets.filter(Boolean).slice(0, 4).map((bullet, bulletIndex) => (
                  <li key={`${item.id}-${bulletIndex}`}>{renderTextWithBoldNumbers(bullet)}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    ) : null;

  const renderSkillsSection = () =>
    data.skills.length > 0 ? (
      <section key="skills">
        <h2>{resolveSectionTitle("skills", DEFAULT_SECTION_TITLES.skills)}</h2>
        <div className="item">
          <p className="detail-line">{renderTextWithBoldNumbers(data.skills.join(", "))}</p>
        </div>
      </section>
    ) : null;

  const renderAchievementsSection = () => {
    const items = data.achievements.filter((item) => item.title || item.details);
    if (items.length === 0) return null;

    return (
      <section key="achievements">
        <h2>{resolveSectionTitle("achievements", DEFAULT_SECTION_TITLES.achievements)}</h2>
        {items.map((item) => (
          <div className="item" key={item.id}>
            <ul>
              <li>
                <strong>{renderTextWithBoldNumbers(item.title)}</strong>
                {item.details ? <span>{` - ${item.details}`}</span> : null}
              </li>
            </ul>
          </div>
        ))}
      </section>
    );
  };

  const renderPositionsSection = () => {
    if (data.positions.length === 0) return null;
    return (
      <section key="positions">
        <h2>{resolveSectionTitle("positions", DEFAULT_SECTION_TITLES.positions)}</h2>
        <div className="item">
          <ul>
            {data.positions.map((entry, index) => (
              <li key={`pos-${index}`}>{renderTextWithBoldNumbers(entry)}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  const renderCertificationsSection = () => {
    if (data.certifications.length === 0) return null;
    return (
      <section key="certifications">
        <h2>{resolveSectionTitle("certifications", DEFAULT_SECTION_TITLES.certifications)}</h2>
        <div className="item">
          <ul>
            {data.certifications.map((entry, index) => (
              <li key={`cert-${index}`}>{renderTextWithBoldNumbers(entry)}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  const renderCaArticleshipSection = () => {
    if (data.caArticleship.length === 0) return null;
    return (
      <section key="caArticleship">
        <h2>{resolveSectionTitle("caArticleship", DEFAULT_SECTION_TITLES.caArticleship)}</h2>
        <div className="item">
          <ul>
            {data.caArticleship.map((entry, index) => (
              <li key={`ca-article-${index}`}>{renderTextWithBoldNumbers(entry)}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  const renderCaAuditSection = () => {
    if (data.caAuditExperience.length === 0) return null;
    return (
      <section key="caAudit">
        <h2>{resolveSectionTitle("caAudit", DEFAULT_SECTION_TITLES.caAudit)}</h2>
        <div className="item">
          <ul>
            {data.caAuditExperience.map((entry, index) => (
              <li key={`ca-audit-${index}`}>{renderTextWithBoldNumbers(entry)}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  const renderCaTaxSection = () => {
    if (data.caTaxationAndCompliance.length === 0) return null;
    return (
      <section key="caTax">
        <h2>{resolveSectionTitle("caTax", DEFAULT_SECTION_TITLES.caTax)}</h2>
        <div className="item">
          <ul>
            {data.caTaxationAndCompliance.map((entry, index) => (
              <li key={`ca-tax-${index}`}>{renderTextWithBoldNumbers(entry)}</li>
            ))}
          </ul>
        </div>
      </section>
    );
  };

  const renderCaToolsSection = () => {
    if (data.caTools.length === 0) return null;
    return (
      <section key="caTools">
        <h2>{resolveSectionTitle("caTools", DEFAULT_SECTION_TITLES.caTools)}</h2>
        <div className="item">
          <p className="detail-line">{renderTextWithBoldNumbers(data.caTools.join(", "))}</p>
        </div>
      </section>
    );
  };

  const sectionRenderer: Record<SectionKey, () => ReactNode> = {
    summary: renderSummarySection,
    education: renderEducationSection,
    experience: renderExperienceSection,
    projects: renderProjectsSection,
    skills: renderSkillsSection,
    achievements: renderAchievementsSection,
    positions: renderPositionsSection,
    certifications: renderCertificationsSection,
    caArticleship: renderCaArticleshipSection,
    caAudit: renderCaAuditSection,
    caTax: renderCaTaxSection,
    caTools: renderCaToolsSection,
  };

  const renderSharedSections = () => {
    const sectionOrder = TEMPLATE_SECTION_ORDER[template] ?? TEMPLATE_SECTION_ORDER.jake;
    return (
      <>
        {sectionOrder.map((key) => {
          const sectionNode = sectionRenderer[key]();
          if (sectionNode) return sectionNode;
          if (!strictTemplate) return null;

          return (
            <section key={`${key}-placeholder`} className="section-placeholder">
              <h2>{resolveSectionTitle(key, DEFAULT_SECTION_TITLES[key])}</h2>
            </section>
          );
        })}
      </>
    );
  };

  const renderHeader = () => {
    if (!hasAnyContent && !strictTemplate) return null;

    const displayName = data.name.trim() || (strictTemplate ? "YOUR NAME" : "");

    if (headerMode === "modern-left") {
      return (
        <header className="resume-header resume-header-modern">
          {displayName && <h1 className="name">{renderTextWithBoldNumbers(displayName)}</h1>}
          {(contactPrimaryDisplay.length > 0 || contactLinks.length > 0) && renderContactLine()}
        </header>
      );
    }

    if (headerMode === "logo-left") {
      return (
        <header className="resume-header resume-header-logo">
          <div className="resume-header-top">
            <div className="resume-header-identity">
              {(data.logoDataUrl || forceInstituteLogo) && (
                <img
                  src={data.logoDataUrl || "data:image/gif;base64,R0lGODlhAQABAAAAACw="}
                  alt="Uploaded logo"
                  className={!data.logoDataUrl ? "logo-hidden" : undefined}
                  style={{ width: `${data.logoSize}px`, height: `${data.logoSize}px`, objectFit: "contain" }}
                />
              )}
              <div className="resume-header-text">
                {displayName && <h1 className="name">{renderTextWithBoldNumbers(displayName)}</h1>}
                {(contactPrimaryDisplay.length > 0 || contactLinks.length > 0) && renderContactLine()}
              </div>
            </div>
          </div>
        </header>
      );
    }

    if (headerMode === "academic-split") {
      return (
        <header className="resume-header resume-header-academic">
          <div className="resume-header-top">
            <div className="resume-header-text">
              {displayName && <h1 className="name">{renderTextWithBoldNumbers(displayName)}</h1>}
            </div>
            <div className="resume-header-right">{(contactPrimaryDisplay.length > 0 || contactLinks.length > 0) && renderContactLine()}</div>
          </div>
        </header>
      );
    }

    return (
      <header className="resume-header resume-header-latex">
        {displayName && <h1 className="name">{renderTextWithBoldNumbers(displayName)}</h1>}
        {(contactPrimaryDisplay.length > 0 || contactLinks.length > 0) && renderContactLine()}
      </header>
    );
  };

  const tableColumns = (() => {
    if (template === "iit-placement") {
      return ["Examination", "University", "Institute", "Year", "CPI/%"];
    }
    if (template === "nsut-placement") {
      return ["Course", "College / University", "Year", "CGPA / %"];
    }
    if (template === "ggsipu-placement") {
      return ["Year", "Degree/Certificate", "Institute", "CGPA / Percentage"];
    }
    return ["Year", "Degree/Certificate", "Institute", "CGPA/%"];
  })();

  const renderTableEducation = () => (
    <section>
      <h2>{resolveSectionTitle("education", DEFAULT_SECTION_TITLES.education)}</h2>
      <table className="w-full border-collapse border border-black text-[10px]">
        <thead>
          <tr>
            {tableColumns.map((column) => (
              <th key={column} className="border border-black px-2 py-1">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.education.map((item) => (
            <tr key={item.id}>
              {template === "iit-placement" ? (
                <>
                  <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.degree)}</td>
                  <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.school)}</td>
                  <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.school)}</td>
                  <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers([item.startDate, item.endDate].filter(Boolean).join("-"))}</td>
                  <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.details)}</td>
                </>
              ) : (
                <>
                  <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers([item.startDate, item.endDate].filter(Boolean).join("-"))}</td>
                  <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.degree)}</td>
                  <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.school)}</td>
                  <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.details)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  return (
    <div className="resume-paper border border-gray-300 shadow-lg" ref={ref}>
      <div
        className={`resume template-${template} font-${layout.fontStyle ?? "serif-pro"}`}
        style={
          {
            "--resume-font-family": FONT_STYLE_STACK[layout.fontStyle ?? "serif-pro"],
            "--resume-font-size": `${layout.fontSize}px`,
            "--resume-line-height": String(layout.lineHeight),
            "--resume-section-gap": `${layout.sectionGap}px`,
            "--resume-item-gap": `${layout.itemGap}px`,
          } as CSSProperties
        }
      >
        {renderHeader()}
        {tableTemplate && data.education.length > 0 ? renderTableEducation() : null}
        {legacyTableTemplate ? (
          <>
            {data.summary.trim() && (
              <section>
                <h2>SUMMARY</h2>
                <div className="item">
                  <p className="detail-line">{renderTextWithBoldNumbers(data.summary)}</p>
                </div>
              </section>
            )}
            {data.experience.length > 0 && (
              <section>
                <h2>EXPERIENCE</h2>
                {data.experience.map((item) => (
                  <div className="item" key={item.id}>
                    <div className="row">
                      <span className="title">{renderTextWithBoldNumbers([item.role, item.company].filter(Boolean).join("  -  "))}</span>
                      <span className="date">{renderTextWithBoldNumbers([item.startDate, item.endDate].filter(Boolean).join("-"))}</span>
                    </div>
                    {item.bullets.filter(Boolean).length > 0 && (
                      <ul>
                        {item.bullets.filter(Boolean).slice(0, 4).map((bullet, bulletIndex) => (
                          <li key={`${item.id}-${bulletIndex}`}>{renderTextWithBoldNumbers(bullet)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}
            {data.projects.length > 0 && (
              <section>
                <h2>PROJECTS</h2>
                {data.projects.map((item) => (
                  <div className="item" key={item.id}>
                    <div className="row">
                      <span className="title">{renderTextWithBoldNumbers([item.name, item.tech].filter(Boolean).join("  -  "))}</span>
                      <span className="date">{renderProjectLinks(item.link)}</span>
                    </div>
                    {item.bullets.filter(Boolean).length > 0 && (
                      <ul>
                        {item.bullets.filter(Boolean).slice(0, 4).map((bullet, bulletIndex) => (
                          <li key={`${item.id}-${bulletIndex}`}>{renderTextWithBoldNumbers(bullet)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            )}
            {data.skills.length > 0 && (
              <section>
                <h2>TECHNICAL SKILLS</h2>
                <div className="item">
                  <p className="detail-line">{renderTextWithBoldNumbers(data.skills.join(", "))}</p>
                </div>
              </section>
            )}
            {data.achievements.filter((item) => item.title || item.details).length > 0 && (
              <section>
                <h2>MISCELLANEOUS</h2>
                {data.achievements
                  .filter((item) => item.title || item.details)
                  .map((item) => (
                    <div className="item" key={item.id}>
                      <ul>
                        <li>
                          <strong>{renderTextWithBoldNumbers(item.title)}</strong>
                          {item.details ? <span>{` - ${item.details}`}</span> : null}
                        </li>
                      </ul>
                    </div>
                  ))}
              </section>
            )}
          </>
        ) : (
          renderSharedSections()
        )}
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

export default ResumePreview;
