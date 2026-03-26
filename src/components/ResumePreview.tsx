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

const FONT_STYLE_STACK: Record<ResumeFontStyle, string> = {
  latex: '"Latin Modern Roman", "Computer Modern Serif", "STIX Two Text", "Times New Roman", serif',
  classic: '"Garamond", "EB Garamond", "Georgia", "Times New Roman", serif',
  modern: '"Source Serif 4", "Cambria", "Palatino Linotype", serif',
};

const numericTokenPattern = /(\d[\d,]*(?:\.\d+)?%?)/g;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s-]{7,}$/;

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

function toHref(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (emailPattern.test(trimmed)) return `mailto:${trimmed}`;
  if (phonePattern.test(trimmed)) return `tel:${trimmed.replace(/\s+/g, "")}`;
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

function renderTextWithBoldNumbers(value: string): ReactNode {
  if (!value) return value;

  const parts = value.split(numericTokenPattern);
  return parts.map((part, index) => {
    if (!part) return null;
    return index % 2 === 1 ? <strong key={`${part}-${index}`}>{part}</strong> : part;
  });
}

function renderLinkLikeText(value: string): ReactNode {
  const href = toHref(value);
  if (!href) return renderTextWithBoldNumbers(value);

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="no-underline"
      style={{ color: "inherit" }}
    >
      {renderTextWithBoldNumbers(value)}
    </a>
  );
}

function renderProjectLinkIcons(value: string): ReactNode {
  const urls = extractProjectUrls(value);
  if (urls.length === 0) return renderTextWithBoldNumbers(value);

  return (
    <span className="inline-flex items-center gap-1.5">
      {urls.map((url, index) => {
        const github = isGithubUrl(url);
        return (
          <a
            key={`${url}-${index}`}
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={github ? "Open GitHub project link" : "Open live project link"}
            className="inline-flex items-center justify-center"
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
          </a>
        );
      })}
    </span>
  );
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, template, layout }, ref) => {
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
      data.achievements.some((item) => item.title || item.details),
  );

  const contactParts = [
    data.location,
    data.email,
    data.phone,
    ...data.links
      .split("|")
      .map((item) => item.trim())
      .filter(Boolean),
  ].filter(Boolean);

  const renderContactLine = () => (
    <p className="contact">
      {contactParts.map((item, index) => (
        <span key={`${item}-${index}`}>
          {index > 0 ? " | " : ""}
          {renderLinkLikeText(item)}
        </span>
      ))}
    </p>
  );

  const renderSharedSections = () => (
    <>
      {data.education.length > 0 && (
        <section>
          <h2>EDUCATION</h2>
          {data.education.map((item) => (
            <div className="item" key={item.id}>
              <div className="row">
                <span className="title">{renderTextWithBoldNumbers(item.school)}</span>
                <span className="date">{renderTextWithBoldNumbers([item.startDate, item.endDate].filter(Boolean).join("-"))}</span>
              </div>
              <p>{renderTextWithBoldNumbers([item.degree, item.details].filter(Boolean).join(" | "))}</p>
            </div>
          ))}
        </section>
      )}

      {data.experience.length > 0 && (
        <section>
          <h2>EXPERIENCE</h2>
          {data.experience.map((item) => (
            <div className="item" key={item.id}>
              <div className="row">
                <span className="title">{renderTextWithBoldNumbers([item.role, item.company].filter(Boolean).join(" | "))}</span>
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
                <span className="title">{renderTextWithBoldNumbers([item.name, item.tech].filter(Boolean).join(" | "))}</span>
                <span className="date">{renderProjectLinkIcons(item.link)}</span>
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
          <h2>SKILLS</h2>
          <div className="item">
            <p>{renderTextWithBoldNumbers(data.skills.join(" | "))}</p>
          </div>
        </section>
      )}

      {data.achievements.filter((item) => item.title || item.details).length > 0 && (
        <section>
          <h2>ACHIEVEMENTS</h2>
          {data.achievements
            .filter((item) => item.title || item.details)
            .map((item) => (
              <div className="item" key={item.id}>
                <ul>
                  <li>{renderTextWithBoldNumbers([item.title, item.details].filter(Boolean).join(" | "))}</li>
                </ul>
              </div>
            ))}
        </section>
      )}
    </>
  );

  const renderHeader = () => {
    if (!hasAnyContent) return null;

    if (template === "modern-clean") {
      return (
        <header className="mb-2 border-b border-black pb-2">
          {data.name && <h1 className="name">{renderTextWithBoldNumbers(data.name)}</h1>}
          {contactParts.length > 0 && renderContactLine()}
        </header>
      );
    }

    if (template === "classic-logo" || template === "table-edu") {
      return (
        <header className="mb-2 flex items-start justify-between gap-4 border-b border-black pb-2">
          <div className="flex items-start gap-3">
            {data.logoDataUrl && (
              <img
                src={data.logoDataUrl}
                alt="Uploaded logo"
                style={{ width: `${data.logoSize}px`, height: `${data.logoSize}px`, objectFit: "contain" }}
              />
            )}
            <div>
              {data.name && <h1 className="name">{renderTextWithBoldNumbers(data.name)}</h1>}
              {data.summary && <p className="contact">{renderTextWithBoldNumbers(data.summary)}</p>}
            </div>
          </div>
          {contactParts.length > 0 && <div className="text-right">{renderContactLine()}</div>}
        </header>
      );
    }

    return (
      <>
        {data.name && <h1 className="name">{renderTextWithBoldNumbers(data.name)}</h1>}
        {contactParts.length > 0 && renderContactLine()}
      </>
    );
  };

  const renderTableEducation = () => (
    <section>
      <h2>EDUCATION</h2>
      <table className="w-full border-collapse border border-black text-[10px]">
        <thead>
          <tr>
            <th className="border border-black px-2 py-1">Year</th>
            <th className="border border-black px-2 py-1">Degree/Certificate</th>
            <th className="border border-black px-2 py-1">Institute</th>
            <th className="border border-black px-2 py-1">CGPA/Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.education.map((item) => (
            <tr key={item.id}>
              <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers([item.startDate, item.endDate].filter(Boolean).join("-"))}</td>
              <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.degree)}</td>
              <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.school)}</td>
              <td className="border border-black px-2 py-1">{renderTextWithBoldNumbers(item.details)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  return (
    <div className="resume-paper border border-gray-300 shadow-lg" ref={ref}>
      <div
        className="resume"
        style={
          {
            "--resume-font-family": FONT_STYLE_STACK[layout.fontStyle ?? "latex"],
            "--resume-font-size": `${layout.fontSize}px`,
            "--resume-line-height": String(layout.lineHeight),
            "--resume-section-gap": `${layout.sectionGap}px`,
            "--resume-item-gap": `${layout.itemGap}px`,
          } as CSSProperties
        }
      >
        {renderHeader()}
        {template === "table-edu" && data.education.length > 0 ? renderTableEducation() : null}
        {template === "table-edu" ? (
          <>
            {data.experience.length > 0 && (
              <section>
                <h2>EXPERIENCE</h2>
                {data.experience.map((item) => (
                  <div className="item" key={item.id}>
                    <div className="row">
                      <span className="title">{renderTextWithBoldNumbers([item.role, item.company].filter(Boolean).join(" | "))}</span>
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
                      <span className="title">{renderTextWithBoldNumbers([item.name, item.tech].filter(Boolean).join(" | "))}</span>
                      <span className="date">{renderProjectLinkIcons(item.link)}</span>
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
                  <p>{renderTextWithBoldNumbers(data.skills.join(" | "))}</p>
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
                        <li>{renderTextWithBoldNumbers([item.title, item.details].filter(Boolean).join(" | "))}</li>
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
