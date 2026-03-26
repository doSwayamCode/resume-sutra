import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useSearchParams } from "react-router-dom";
import AIButton from "../components/AIButton";
import FormSection from "../components/FormSection";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import { ResumeFontStyle, ResumeTemplate, useResumeStore } from "../store/useResumeStore";

type SuggestionState = {
  key: string;
  value: string;
  onAccept: (value: string) => void;
};

type TemplateFormConfig = {
  supportsLogo: boolean;
  showSummary: boolean;
  showAchievements: boolean;
  showCertificationsAndPositions: boolean;
};

const TEMPLATE_FORM_CONFIG: Record<ResumeTemplate, TemplateFormConfig> = {
  jake: {
    supportsLogo: false,
    showSummary: false,
    showAchievements: true,
    showCertificationsAndPositions: false,
  },
  "classic-logo": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: false,
  },
  "table-edu": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: false,
  },
  "modern-clean": {
    supportsLogo: false,
    showSummary: false,
    showAchievements: true,
    showCertificationsAndPositions: false,
  },
};

const FONT_STYLE_OPTIONS: Array<{ value: ResumeFontStyle; label: string }> = [
  { value: "latex", label: "LaTeX Professional" },
  { value: "classic", label: "Classic Serif" },
  { value: "modern", label: "Modern Serif" },
];

const FONT_SIZE_OPTIONS = [12.5, 13, 13.5, 14, 14.5];

function toBullets(rawText: string) {
  return rawText
    .split("\n")
    .map((line) => line.replace(/^[-*•\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 4);
}

function getResumePlainText(data: ReturnType<typeof useResumeStore.getState>["data"]) {
  const sections: string[] = [];
  sections.push(`Name: ${data.name}`);
  sections.push(`Contact: ${[data.email, data.phone, data.location, data.links].filter(Boolean).join(" | ")}`);
  sections.push(`Summary: ${data.summary}`);
  sections.push(
    `Education: ${data.education
      .map((item) => `${item.school} ${item.degree} ${item.details} ${item.startDate}-${item.endDate}`)
      .join("; ")}`,
  );
  sections.push(
    `Experience: ${data.experience
      .map((item) => `${item.role} ${item.company} ${item.startDate}-${item.endDate} ${item.bullets.join(" | ")}`)
      .join("; ")}`,
  );
  sections.push(
    `Projects: ${data.projects
      .map((item) => `${item.name} ${item.tech} ${item.link} ${item.bullets.join(" | ")}`)
      .join("; ")}`,
  );
  sections.push(`Skills: ${data.skills.join(", ")}`);
  sections.push(`Achievements: ${data.achievements.map((item) => `${item.title} ${item.details}`).join("; ")}`);
  return sections.join("\n");
}

function Builder() {
  const {
    template,
    setTemplate,
    data,
    layout,
    setLayout,
    resetLayout,
    updateRootField,
    addEducation,
    removeEducation,
    updateEducation,
    addExperience,
    removeExperience,
    updateExperienceField,
    updateExperienceBullet,
    setExperienceBullets,
    addExperienceBullet,
    removeExperienceBullet,
    addProject,
    removeProject,
    updateProjectField,
    updateProjectBullet,
    setProjectBullets,
    addProjectBullet,
    removeProjectBullet,
    addAchievement,
    removeAchievement,
    updateAchievement,
    updateSkillsFromText,
    updateSimpleListFromText,
  } = useResumeStore();
  const [searchParams] = useSearchParams();
  const activeTemplateConfig = TEMPLATE_FORM_CONFIG[template];

  const [loadingKey, setLoadingKey] = useState<string>("");
  const [suggestion, setSuggestion] = useState<SuggestionState | null>(null);
  const [jdText, setJdText] = useState("");
  const [jdResult, setJdResult] = useState("");
  const [grammarInput, setGrammarInput] = useState("");
  const [message, setMessage] = useState("");
  const [debouncedData, setDebouncedData] = useState(data);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedData(data);
    }, 140);
    return () => clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    const fromQuery = searchParams.get("template") as ResumeTemplate | null;
    if (!fromQuery) return;
    if (["jake", "classic-logo", "table-edu", "modern-clean"].includes(fromQuery)) {
      setTemplate(fromQuery);
    }
  }, [searchParams, setTemplate]);

  const skillsText = useMemo(() => data.skills.join(", "), [data.skills]);
  const certText = useMemo(() => data.certifications.join("\n"), [data.certifications]);
  const positionsText = useMemo(() => data.positions.join("\n"), [data.positions]);

  const callImprove = async (payload: { mode: "experience" | "summary" | "grammar"; input: string }) => {
    setLoadingKey(payload.mode + payload.input.slice(0, 12));
    setMessage("");
    try {
      const response = await axios.post<{ suggestion: string }>("/api/improve", payload);
      return response.data.suggestion;
    } catch (error) {
      const fallback = error instanceof Error ? error.message : "AI request failed";
      setMessage(fallback);
      return "";
    } finally {
      setLoadingKey("");
    }
  };

  const applyOnePage = async () => {
    const el = previewRef.current;
    if (!el) return;

    resetLayout();
    await new Promise((resolve) => setTimeout(resolve, 40));

    let guard = 0;
    while (guard < 20) {
      guard += 1;
      if (el.scrollHeight <= el.clientHeight) break;

      setLayout((prev) => ({
        fontSize: Math.max(9.5, prev.fontSize - 0.2),
        lineHeight: Math.max(1.2, prev.lineHeight - 0.02),
        sectionGap: Math.max(8, prev.sectionGap - 0.4),
        itemGap: Math.max(4, prev.itemGap - 0.3),
      }));

      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    if (el.scrollHeight > el.clientHeight) {
      setMessage("Content is still long. Reduce bullet count to fit one page.");
    } else {
      setMessage("Resume fitted to one page.");
    }
  };

  const downloadPdf = async () => {
    const source = previewRef.current;
    if (!source) return;

    setMessage("");
    await new Promise((resolve) => setTimeout(resolve, 60));

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = await html2canvas(source, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        width: 794,
        height: 1122,
        scrollX: 0,
        scrollY: 0,
      });

      const imageData = canvas.toDataURL("image/png", 1);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      pdf.addImage(imageData, "PNG", 0, 0, 595.28, 841.89, undefined, "FAST");
      pdf.save(`${(data.name || "resume").replace(/\s+/g, "-").toLowerCase()}.pdf`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to generate PDF");
    }
  };

  const analyzeJD = async () => {
    setLoadingKey("jd");
    setMessage("");
    try {
      const response = await axios.post<{ result: string }>("/api/jd-match", {
        jd: jdText,
        resume: getResumePlainText(data),
      });
      setJdResult(response.data.result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "JD analysis failed");
    } finally {
      setLoadingKey("");
    }
  };

  const onLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      updateRootField("logoDataUrl", result);
    };
    reader.readAsDataURL(file);
  };

  const renderInlineSuggestion = (key: string) => {
    if (!suggestion || suggestion.key !== key) return null;

    return (
      <section className="app-glass rounded-lg border border-indigo-200 bg-white p-3 shadow-sm shadow-indigo-100/40">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700">AI Suggestion</h3>
        <textarea
          className="field-focus mt-2 h-28 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          value={suggestion.value}
          onChange={(event) => setSuggestion((prev) => (prev ? { ...prev, value: event.target.value } : prev))}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            onClick={() => {
              suggestion.onAccept(suggestion.value);
              setSuggestion(null);
            }}
          >
            Accept
          </button>
          <button className="rounded border border-slate-300 px-3 py-1.5 text-xs" onClick={() => setSuggestion(null)}>
            Discard
          </button>
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen px-3 py-4 lg:px-6 lg:py-6">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr]">
        <section className="space-y-4">
          <header className="app-glass rounded-xl border border-purple-100 p-4 shadow-md shadow-purple-100/40">
            <img
              src="/resumesutra-logo.svg"
              alt="ResumeSutra logo"
              className="h-auto w-full max-w-[300px] object-contain"
            />
            <h1 className="mt-2 text-xl font-bold text-slate-900">ResumeSutra Builder</h1>
            <p className="mt-1 text-sm text-slate-600">
              Build an ATS-optimized one-page resume with AI suggestions and exact PDF output.
            </p>
          </header>

          <TemplateSelector value={template} onChange={setTemplate} />

          <FormSection title="Name + Contact">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                className="rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="Full name"
                value={data.name}
                onChange={(event) => updateRootField("name", event.target.value)}
              />
              <input
                className="rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="Email"
                value={data.email}
                onChange={(event) => updateRootField("email", event.target.value)}
              />
              <input
                className="rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="Phone"
                value={data.phone}
                onChange={(event) => updateRootField("phone", event.target.value)}
              />
              <input
                className="rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="Location"
                value={data.location}
                onChange={(event) => updateRootField("location", event.target.value)}
              />
            </div>
            <input
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Links (GitHub | LinkedIn | Portfolio)"
              value={data.links}
              onChange={(event) => updateRootField("links", event.target.value)}
            />
            {activeTemplateConfig.supportsLogo && (
              <>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                  <label className="block text-xs font-medium text-slate-700">
                    Optional top logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onLogoUpload}
                      className="field-focus mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => updateRootField("logoDataUrl", "")}
                    className="self-end rounded border border-slate-300 px-3 py-2 text-xs text-slate-600"
                  >
                    Remove Logo
                  </button>
                </div>
                <label className="block text-xs font-medium text-slate-700">
                  Logo size: {data.logoSize}px
                  <input
                    type="range"
                    min={56}
                    max={120}
                    step={2}
                    value={data.logoSize}
                    onChange={(event) => updateRootField("logoSize", Number(event.target.value))}
                    className="mt-1 w-full"
                  />
                </label>
              </>
            )}
          </FormSection>

          {activeTemplateConfig.showSummary && (
            <FormSection
              title="Summary"
              actions={
                <AIButton
                  loading={loadingKey.startsWith("summary")}
                  onClick={async () => {
                    const value = await callImprove({ mode: "summary", input: data.summary });
                    if (!value) return;
                    setSuggestion({
                      key: "summary",
                      value,
                      onAccept: (next) => updateRootField("summary", next),
                    });
                  }}
                />
              }
            >
              <textarea
                className="h-20 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="2-line professional summary"
                value={data.summary}
                onChange={(event) => updateRootField("summary", event.target.value)}
              />
              {renderInlineSuggestion("summary")}
            </FormSection>
          )}

          <FormSection title="Education" actions={<button className="text-xs font-semibold" onClick={addEducation}>+ Add</button>}>
            {data.education.map((item) => (
              <div key={item.id} className="space-y-2 rounded border border-gray-200 p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="School"
                    value={item.school}
                    onChange={(event) => updateEducation(item.id, "school", event.target.value)}
                  />
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Degree"
                    value={item.degree}
                    onChange={(event) => updateEducation(item.id, "degree", event.target.value)}
                  />
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Start"
                    value={item.startDate}
                    onChange={(event) => updateEducation(item.id, "startDate", event.target.value)}
                  />
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="End"
                    value={item.endDate}
                    onChange={(event) => updateEducation(item.id, "endDate", event.target.value)}
                  />
                </div>
                <input
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Details (CGPA, coursework)"
                  value={item.details}
                  onChange={(event) => updateEducation(item.id, "details", event.target.value)}
                />
                <button className="text-xs text-red-600" onClick={() => removeEducation(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </FormSection>

          <FormSection title="Experience" actions={<button className="text-xs font-semibold" onClick={addExperience}>+ Add</button>}>
            {data.experience.map((item) => (
              <div key={item.id} className="space-y-2 rounded border border-gray-200 p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Role"
                    value={item.role}
                    onChange={(event) => updateExperienceField(item.id, "role", event.target.value)}
                  />
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Company"
                    value={item.company}
                    onChange={(event) => updateExperienceField(item.id, "company", event.target.value)}
                  />
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Start"
                    value={item.startDate}
                    onChange={(event) => updateExperienceField(item.id, "startDate", event.target.value)}
                  />
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="End"
                    value={item.endDate}
                    onChange={(event) => updateExperienceField(item.id, "endDate", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {item.bullets.map((bullet, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-2">
                      <textarea
                        className="h-16 flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                        placeholder={`Bullet ${index + 1}`}
                        value={bullet}
                        onChange={(event) => updateExperienceBullet(item.id, index, event.target.value)}
                      />
                      <button className="self-start rounded border px-2 py-1 text-xs" onClick={() => removeExperienceBullet(item.id, index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => addExperienceBullet(item.id)}>
                      + Bullet
                    </button>
                    <AIButton
                      loading={loadingKey.startsWith(`experience-${item.id}`)}
                      onClick={async () => {
                        setLoadingKey(`experience-${item.id}`);
                        const value = await callImprove({
                          mode: "experience",
                          input: item.bullets.filter(Boolean).join("\n"),
                        });
                        setLoadingKey("");
                        if (!value) return;
                        setSuggestion({
                          key: `experience-${item.id}`,
                          value,
                          onAccept: (next) => {
                            const bullets = toBullets(next);
                            setExperienceBullets(item.id, bullets);
                          },
                        });
                      }}
                      label="Improve bullets"
                    />
                  </div>
                  {renderInlineSuggestion(`experience-${item.id}`)}
                </div>

                <button className="text-xs text-red-600" onClick={() => removeExperience(item.id)}>
                  Remove Experience
                </button>
              </div>
            ))}
          </FormSection>

          <FormSection title="Projects" actions={<button className="text-xs font-semibold" onClick={addProject}>+ Add</button>}>
            {data.projects.map((item) => (
              <div key={item.id} className="space-y-2 rounded border border-gray-200 p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Project name"
                    value={item.name}
                    onChange={(event) => updateProjectField(item.id, "name", event.target.value)}
                  />
                  <input
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Tech stack"
                    value={item.tech}
                    onChange={(event) => updateProjectField(item.id, "tech", event.target.value)}
                  />
                </div>
                <input
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Project link"
                  value={item.link}
                  onChange={(event) => updateProjectField(item.id, "link", event.target.value)}
                />
                <div className="space-y-2">
                  {item.bullets.map((bullet, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-2">
                      <textarea
                        className="h-16 flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                        placeholder={`Bullet ${index + 1}`}
                        value={bullet}
                        onChange={(event) => updateProjectBullet(item.id, index, event.target.value)}
                      />
                      <button className="self-start rounded border px-2 py-1 text-xs" onClick={() => removeProjectBullet(item.id, index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2">
                    <button className="rounded border px-2 py-1 text-xs" onClick={() => addProjectBullet(item.id)}>
                      + Bullet
                    </button>
                    <AIButton
                      loading={loadingKey.startsWith(`project-${item.id}`)}
                      onClick={async () => {
                        setLoadingKey(`project-${item.id}`);
                        const value = await callImprove({
                          mode: "experience",
                          input: item.bullets.filter(Boolean).join("\n"),
                        });
                        setLoadingKey("");
                        if (!value) return;
                        setSuggestion({
                          key: `project-${item.id}`,
                          value,
                          onAccept: (next) => {
                            const bullets = toBullets(next);
                            setProjectBullets(item.id, bullets);
                          },
                        });
                      }}
                      label="Improve bullets"
                    />
                  </div>
                  {renderInlineSuggestion(`project-${item.id}`)}
                </div>
                <button className="text-xs text-red-600" onClick={() => removeProject(item.id)}>
                  Remove Project
                </button>
              </div>
            ))}
          </FormSection>

          <FormSection title="Skills (Required)">
            <textarea
              className="h-20 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Comma separated skills"
              value={skillsText}
              onChange={(event) => updateSkillsFromText(event.target.value)}
            />
          </FormSection>

          {activeTemplateConfig.showAchievements && (
            <FormSection title="Achievements (Optional)" actions={<button className="text-xs font-semibold" onClick={addAchievement}>+ Add</button>}>
              {data.achievements.map((item) => (
                <div key={item.id} className="space-y-2 rounded border border-gray-200 p-3">
                  <input
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Achievement title"
                    value={item.title}
                    onChange={(event) => updateAchievement(item.id, "title", event.target.value)}
                  />
                  <textarea
                    className="h-16 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Details"
                    value={item.details}
                    onChange={(event) => updateAchievement(item.id, "details", event.target.value)}
                  />
                  <button className="text-xs text-red-600" onClick={() => removeAchievement(item.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </FormSection>
          )}

          {activeTemplateConfig.showCertificationsAndPositions && (
            <FormSection title="Certifications / Positions (Optional)">
              <textarea
                className="h-16 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="One certification per line"
                value={certText}
                onChange={(event) => updateSimpleListFromText("certifications", event.target.value)}
              />
              <textarea
                className="h-16 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="One position per line"
                value={positionsText}
                onChange={(event) => updateSimpleListFromText("positions", event.target.value)}
              />
            </FormSection>
          )}

          <FormSection title="Grammar + Impact Checker">
            <textarea
              className="h-16 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Paste a sentence to improve"
              value={grammarInput}
              onChange={(event) => setGrammarInput(event.target.value)}
            />
            <AIButton
              label="Improve sentence"
              loading={loadingKey.startsWith("grammar")}
              onClick={async () => {
                const value = await callImprove({ mode: "grammar", input: grammarInput });
                if (!value) return;
                setSuggestion({
                  key: "grammar",
                  value,
                  onAccept: (next) => setGrammarInput(next),
                });
              }}
            />
            {renderInlineSuggestion("grammar")}
          </FormSection>

          <FormSection title="Job Description Match">
            <textarea
              className="h-28 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Paste target job description"
              value={jdText}
              onChange={(event) => setJdText(event.target.value)}
            />
            <AIButton label="Analyze JD Match" loading={loadingKey === "jd"} onClick={analyzeJD} />
            {jdResult && <pre className="whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs leading-5">{jdResult}</pre>}
          </FormSection>

          {message && <p className="app-glass rounded border border-slate-200 p-3 text-xs text-slate-700">{message}</p>}
        </section>

        <section className="space-y-3 xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)] xl:overflow-auto">
          <div className="app-glass flex flex-wrap gap-2 rounded-lg border border-slate-200 p-3 shadow-md shadow-slate-200/40">
            <button
              className="rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              onClick={downloadPdf}
            >
              Download 1-Page PDF
            </button>
            <button className="rounded border border-blue-500 px-3 py-2 text-xs font-semibold text-blue-700" onClick={applyOnePage}>
              Make it 1-page
            </button>
            <button className="rounded border border-slate-300 px-3 py-2 text-xs text-slate-700" onClick={resetLayout}>
              Reset spacing
            </button>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700">
              Text size
              <select
                className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs"
                value={String(layout.fontSize)}
                onChange={(event) => setLayout({ fontSize: Number(event.target.value) })}
              >
                {FONT_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
            </label>
            <label className="ml-auto flex items-center gap-2 text-xs font-medium text-slate-700">
              Font style
              <select
                className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs"
                value={layout.fontStyle ?? "latex"}
                onChange={(event) => setLayout({ fontStyle: event.target.value as ResumeFontStyle })}
              >
                {FONT_STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="preview-canvas overflow-auto rounded-lg border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-200 p-4">
            <ResumePreview data={debouncedData} layout={layout} template={template} ref={previewRef} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Builder;
