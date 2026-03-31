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

type ResumeHealth = {
  score: number;
  positives: string[];
  warnings: string[];
};

const IIT_COLLEGES = [
  "IIT Bombay",
  "IIT Delhi",
  "IIT Kanpur",
  "IIT Kharagpur",
  "IIT Madras",
  "IIT Roorkee",
  "IIT Guwahati",
  "IIT Bhubaneswar",
  "IIT Gandhinagar",
  "IIT Hyderabad",
  "IIT Indore",
  "IIT Jodhpur",
  "IIT Mandi",
  "IIT Patna",
  "IIT Ropar",
  "IIT (BHU) Varanasi",
  "IIT Palakkad",
  "IIT Tirupati",
  "IIT Dhanbad",
  "IIT Bhilai",
  "IIT Goa",
  "IIT Jammu",
  "IIT Dharwad",
];
const NIT_COLLEGES = [
  "NIT Agartala",
  "NIT Allahabad",
  "NIT Andhra Pradesh",
  "NIT Arunachal Pradesh",
  "NIT Calicut",
  "NIT Delhi",
  "NIT Durgapur",
  "NIT Goa",
  "NIT Hamirpur",
  "NIT Jamshedpur",
  "NIT Kurukshetra",
  "NIT Manipur",
  "NIT Meghalaya",
  "NIT Mizoram",
  "NIT Nagaland",
  "NIT Patna",
  "NIT Puducherry",
  "NIT Raipur",
  "NIT Rourkela",
  "NIT Sikkim",
  "NIT Silchar",
  "NIT Srinagar",
  "NIT Surat",
  "NIT Surathkal",
  "NIT Tiruchirappalli",
  "NIT Uttarakhand",
  "NIT Warangal",
];
const IIIT_COLLEGES = ["IIIT Hyderabad", "IIIT Bangalore", "IIIT Delhi", "IIIT Allahabad", "IIIT Guwahati"];
const IIM_COLLEGES = [
  "IIM Ahmedabad",
  "IIM Amritsar",
  "IIM Bangalore",
  "IIM Bodh Gaya",
  "IIM Calcutta",
  "IIM Indore",
  "IIM Jammu",
  "IIM Kashipur",
  "IIM Kozhikode",
  "IIM Lucknow",
  "IIM Mumbai",
  "IIM Nagpur",
  "IIM Raipur",
  "IIM Ranchi",
  "IIM Rohtak",
  "IIM Sambalpur",
  "IIM Shillong",
  "IIM Sirmaur",
  "IIM Tiruchirappalli",
  "IIM Udaipur",
  "IIM Visakhapatnam",
];
const BITS_CAMPUSES = ["BITS Pilani", "BITS Goa", "BITS Hyderabad", "BITS Dubai"];

const TEMPLATE_COLLEGE_OPTIONS: Partial<Record<ResumeTemplate, string[]>> = {
  "iit-placement": IIT_COLLEGES,
  "nit-placement": NIT_COLLEGES,
  "iiit-placement": IIIT_COLLEGES,
  "iim-management": IIM_COLLEGES,
  "bits-placement": BITS_CAMPUSES,
};

const FIXED_TEMPLATE_LOGO: Partial<Record<ResumeTemplate, string>> = {
  "dtu-placement": "/logos/dtu.png",
  "nsut-placement": "/logos/nsut.svg",
  "ggsipu-placement": "/logos/ggsipu.svg",
  "igdtuw-placement": "/logos/igdtuw-official.png",
  "iisc-academic": "/logos/iisc.svg",
};

const COLLEGE_LOGO_MAP: Record<string, string> = {
  "IIT Bombay": "/logos/iit-bombay.svg",
  "IIT Delhi": "/logos/iit-delhi.svg",
  "IIT Kanpur": "/logos/iit-kanpur.svg",
  "IIT Kharagpur": "/logos/iit-kharagpur.svg",
  "IIT Madras": "/logos/iit-madras.svg",
  "IIT Roorkee": "/logos/iit-roorkee.svg",
  "IIT Guwahati": "/logos/iit-guwahati.svg",
  "IIT Bhubaneswar": "/logos/iit-bhubaneswar.svg",
  "IIT Gandhinagar": "/logos/iit-gandhinagar.svg",
  "IIT Hyderabad": "/logos/iit-hyderabad.svg",
  "IIT Indore": "/logos/iit-indore.svg",
  "IIT Jodhpur": "/logos/iit-jodhpur.svg",
  "IIT Mandi": "/logos/iit-mandi.svg",
  "IIT Patna": "/logos/iit-patna.svg",
  "IIT Ropar": "/logos/iit-ropar.svg",
  "IIT Palakkad": "/logos/iit-palakkad.svg",
  "IIT (BHU) Varanasi": "/logos/iit-bhu.svg",
  "IIT BHU": "/logos/iit-bhu.svg",
  "IIT Tirupati": "/logos/iit-tirupati.svg",
  "IIT Dhanbad": "/logos/iit-dhanbad.svg",
  "IIT Bhilai": "/logos/iit-bhilai.svg",
  "IIT Goa": "/logos/iit-goa.svg",
  "IIT Jammu": "/logos/iit-jammu.svg",
  "IIT Dharwad": "/logos/iit-dharwad.svg",
  "NIT Agartala": "/logos/nit-agartala.png",
  "NIT Allahabad": "/logos/nit-allahabad.png",
  "NIT Arunachal Pradesh": "/logos/nit-arunachal.png",
  "NIT Delhi": "/logos/nit-delhi.svg",
  "NIT Durgapur": "/logos/nit-durgapur.svg",
  "NIT Goa": "/logos/nit-goa.png",
  "NIT Hamirpur": "/logos/nit-hamirpur.png",
  "NIT Jamshedpur": "/logos/nit-jamshedpur.png",
  "NIT Kurukshetra": "/logos/nit-kurukshetra.png",
  "NIT Manipur": "/logos/nit-manipur.png",
  "NIT Meghalaya": "/logos/nit-meghalaya.png",
  "NIT Mizoram": "/logos/nit-mizoram.png",
  "NIT Nagaland": "/logos/nit-nagaland.png",
  "NIT Patna": "/logos/nit-patna.png",
  "NIT Puducherry": "/logos/nit-puducherry.png",
  "NIT Raipur": "/logos/nit-raipur.png",
  "NIT Sikkim": "/logos/nit-sikkim.svg",
  "NIT Silchar": "/logos/nit-silchar.svg",
  "NIT Srinagar": "/logos/nit-srinagar.png",
  "NIT Surat": "/logos/nit-surat.svg",
  "NIT Tiruchirappalli": "/logos/nit-tiruchirappalli.svg",
  "NIT Trichy": "/logos/nit-tiruchirappalli.svg",
  "NIT Tiruchapalli": "/logos/nit-tiruchirappalli.svg",
  "NIT Uttarakhand": "/logos/nit-uttarakhand.png",
  "NIT Warangal": "/logos/nit-warangal.png",
  "NIT Surathkal": "/logos/nit-surathkal-official.png",
  "NIT Rourkela": "/logos/nit-rourkela-official.png",
  "NIT Calicut": "/logos/nit-calicut.svg",
  "IIIT Hyderabad": "/logos/iiit-hyderabad.png",
  "IIIT Bangalore": "/logos/iiit-bangalore.svg",
  "IIIT Delhi": "/logos/iiit-delhi-official.svg",
  "IIIT Allahabad": "/logos/iiit-allahabad.png",
  "IIIT Guwahati": "/logos/iiit-guwahati.svg",
  "IIM Amritsar": "/logos/iim-amritsar.svg",
  "IIM Ahmedabad": "/logos/iim-ahmedabad.svg",
  "IIM Bangalore": "/logos/iim-bangalore.svg",
  "IIM Bodh Gaya": "/logos/iim-bodhgaya.png",
  "IIM Calcutta": "/logos/iim-calcutta.svg",
  "IIM Jammu": "/logos/iim-jammu.png",
  "IIM Kashipur": "/logos/iim-kashipur.png",
  "IIM Lucknow": "/logos/iim-lucknow.svg",
  "IIM Kozhikode": "/logos/iim-kozhikode.svg",
  "IIM Indore": "/logos/iim-indore.svg",
  "IIM Mumbai": "/logos/iim-mumbai.svg",
  "IIM Nagpur": "/logos/iim-nagpur.jpg",
  "IIM Raipur": "/logos/iim-raipur.png",
  "IIM Ranchi": "/logos/iim-ranchi.svg",
  "IIM Rohtak": "/logos/iim-rohtak.png",
  "IIM Sambalpur": "/logos/iim-sambalpur.svg",
  "IIM Shillong": "/logos/iim-shillong.png",
  "IIM Sirmaur": "/logos/iim-sirmaur.png",
  "IIM Tiruchirappalli": "/logos/iim-trichy.png",
  "IIM Trichy": "/logos/iim-trichy.png",
  "IIM Udaipur": "/logos/iim-udaipur.png",
  "IIM Visakhapatnam": "/logos/iim-visakhapatnam.png",
  "BITS Pilani": "/logos/bits-pilani.svg",
  "BITS Goa": "/logos/bits-goa.svg",
  "BITS Hyderabad": "/logos/bits-hyderabad.svg",
  "BITS Dubai": "/logos/bits-dubai.png",
};

const COLLEGE_FAMILY_FALLBACK_LOGO: Array<{ prefix: string; logo: string }> = [
  { prefix: "BITS ", logo: "/logos/bits-pilani.svg" },
];

function resolveDefaultLogo(template: ResumeTemplate, collegeName: string): string {
  if (FIXED_TEMPLATE_LOGO[template]) {
    return FIXED_TEMPLATE_LOGO[template] ?? "";
  }
  if (!collegeName.trim()) {
    return "";
  }
  if (COLLEGE_LOGO_MAP[collegeName]) {
    return COLLEGE_LOGO_MAP[collegeName];
  }

  const fallbackByFamily = COLLEGE_FAMILY_FALLBACK_LOGO.find((entry) => collegeName.startsWith(entry.prefix));
  return fallbackByFamily?.logo ?? "";
}

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
  "dtu-placement": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: false,
  },
  "nsut-placement": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: false,
  },
  "iit-placement": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: true,
  },
  "nit-placement": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: true,
  },
  "iiit-placement": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: true,
  },
  "iisc-academic": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: true,
  },
  "igdtuw-placement": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: false,
  },
  "bits-placement": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: true,
  },
  "iim-management": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: true,
  },
  "ggsipu-placement": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: true,
  },
  "ca-professional": {
    supportsLogo: true,
    showSummary: true,
    showAchievements: true,
    showCertificationsAndPositions: true,
  },
};

const FONT_STYLE_OPTIONS: Array<{ value: ResumeFontStyle; label: string }> = [
  { value: "serif-pro", label: "Professional Serif (Recommended)" },
  { value: "latex", label: "LaTeX Classic" },
  { value: "modern", label: "Modern Serif" },
  { value: "classic", label: "Classic Garamond" },
  { value: "executive", label: "Executive Readable" },
  { value: "clean-sans", label: "Clean Sans" },
];

const FONT_SIZE_OPTIONS = [12, 12.5, 12.8, 13, 13.5, 14, 14.5];

const TEMPLATE_LAYOUT_PRESETS: Record<ResumeTemplate, Partial<ReturnType<typeof useResumeStore.getState>["layout"]>> = {
  jake: { fontStyle: "serif-pro", fontSize: 12.8, lineHeight: 1.34, sectionGap: 9, itemGap: 4 },
  "classic-logo": { fontStyle: "classic", fontSize: 12.6, lineHeight: 1.33, sectionGap: 9, itemGap: 4 },
  "table-edu": { fontStyle: "clean-sans", fontSize: 12.4, lineHeight: 1.3, sectionGap: 9, itemGap: 4 },
  "modern-clean": { fontStyle: "modern", fontSize: 12.8, lineHeight: 1.36, sectionGap: 9, itemGap: 4 },
  "dtu-placement": { fontStyle: "latex", fontSize: 12.7, lineHeight: 1.33, sectionGap: 8.5, itemGap: 3.8 },
  "nsut-placement": { fontStyle: "latex", fontSize: 12.7, lineHeight: 1.33, sectionGap: 8.5, itemGap: 3.8 },
  "iit-placement": { fontStyle: "latex", fontSize: 12.7, lineHeight: 1.32, sectionGap: 8.2, itemGap: 3.6 },
  "nit-placement": { fontStyle: "serif-pro", fontSize: 12.6, lineHeight: 1.33, sectionGap: 8.5, itemGap: 3.7 },
  "iiit-placement": { fontStyle: "latex", fontSize: 12.7, lineHeight: 1.32, sectionGap: 8.3, itemGap: 3.6 },
  "iisc-academic": { fontStyle: "executive", fontSize: 12.8, lineHeight: 1.37, sectionGap: 9.4, itemGap: 4.1 },
  "igdtuw-placement": { fontStyle: "serif-pro", fontSize: 12.7, lineHeight: 1.34, sectionGap: 8.8, itemGap: 3.8 },
  "bits-placement": { fontStyle: "modern", fontSize: 12.8, lineHeight: 1.35, sectionGap: 8.8, itemGap: 3.8 },
  "iim-management": { fontStyle: "executive", fontSize: 12.8, lineHeight: 1.36, sectionGap: 9.2, itemGap: 4 },
  "ggsipu-placement": { fontStyle: "classic", fontSize: 12.6, lineHeight: 1.33, sectionGap: 8.6, itemGap: 3.7 },
  "ca-professional": { fontStyle: "executive", fontSize: 12.7, lineHeight: 1.35, sectionGap: 9, itemGap: 3.9 },
};

function computeResumeHealth(data: ReturnType<typeof useResumeStore.getState>["data"]): ResumeHealth {
  const positives: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  if (data.name.trim() && data.email.trim() && data.phone.trim()) {
    positives.push("Core contact details are present.");
  } else {
    warnings.push("Add full contact details (name, email, phone).");
    score -= 12;
  }

  if (data.summary.trim().length >= 80) {
    positives.push("Summary is detailed enough for recruiters.");
  } else {
    warnings.push("Write a stronger 2-line summary with role focus.");
    score -= 10;
  }

  if (data.skills.length >= 10) {
    positives.push("Skills section has good keyword depth.");
  } else {
    warnings.push("Add 10+ skills for better ATS keyword coverage.");
    score -= 10;
  }

  const experienceBullets = data.experience.flatMap((item) => item.bullets.filter(Boolean));
  if (experienceBullets.length >= 3) {
    positives.push("Experience has multiple bullet points.");
  } else {
    warnings.push("Add at least 3 experience bullets with impact.");
    score -= 12;
  }

  const metricBullets = [...experienceBullets, ...data.projects.flatMap((item) => item.bullets.filter(Boolean))].filter((line) =>
    /\d|%|\$|x\b/i.test(line),
  );

  if (metricBullets.length >= 2) {
    positives.push("Impact metrics detected in bullet points.");
  } else {
    warnings.push("Include numbers/percentages in bullets to show impact.");
    score -= 10;
  }

  if (data.education.length > 0 && data.projects.length > 0) {
    positives.push("Education and project sections are populated.");
  } else {
    warnings.push("Complete education and project sections.");
    score -= 8;
  }

  if (warnings.length === 0) {
    positives.push("Resume is market-ready and ATS-strong.");
  }

  return { score: Math.max(0, score), positives, warnings };
}

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
  sections.push(`College: ${data.collegeName}`);
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
  sections.push(`CA Articleship: ${data.caArticleship.join("; ")}`);
  sections.push(`CA Audit Experience: ${data.caAuditExperience.join("; ")}`);
  sections.push(`CA Taxation & Compliance: ${data.caTaxationAndCompliance.join("; ")}`);
  sections.push(`CA Tools: ${data.caTools.join("; ")}`);
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
    resetDraft,
  } = useResumeStore();
  const [searchParams] = useSearchParams();
  const safeTemplate: ResumeTemplate = TEMPLATE_FORM_CONFIG[template] ? template : "jake";
  const activeTemplateConfig = TEMPLATE_FORM_CONFIG[safeTemplate];

  useEffect(() => {
    if (template !== safeTemplate) {
      setTemplate(safeTemplate);
    }
  }, [template, safeTemplate, setTemplate]);

  const [loadingKey, setLoadingKey] = useState<string>("");
  const [suggestion, setSuggestion] = useState<SuggestionState | null>(null);
  const [jdText, setJdText] = useState("");
  const [jdResult, setJdResult] = useState("");
  const [grammarInput, setGrammarInput] = useState("");
  const [recruiterContext, setRecruiterContext] = useState("");
  const [recruiterResult, setRecruiterResult] = useState("");
  const [message, setMessage] = useState("");
  const [debouncedData, setDebouncedData] = useState(data);
  const [skillsInput, setSkillsInput] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedData(data);
    }, 140);
    return () => clearTimeout(timer);
  }, [data]);

  useEffect(() => {
    const fromQuery = searchParams.get("template") as ResumeTemplate | null;
    const fresh = searchParams.get("fresh") === "1";
    if (!fromQuery) return;

    const allowedTemplates: ResumeTemplate[] = [
      "jake",
      "classic-logo",
      "table-edu",
      "modern-clean",
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
    ];

    if (!allowedTemplates.includes(fromQuery)) return;

    let applied = false;
    const applyTemplateFromQuery = () => {
      if (applied) return;
      applied = true;
      if (fresh) resetDraft();
      setTemplate(fromQuery);
      setLayout(TEMPLATE_LAYOUT_PRESETS[fromQuery]);
    };

    const persistApi = (useResumeStore as unknown as {
      persist?: {
        hasHydrated: () => boolean;
        onFinishHydration: (listener: () => void) => () => void;
      };
    }).persist;

    if (!persistApi) {
      applyTemplateFromQuery();
      return;
    }

    if (persistApi.hasHydrated()) {
      applyTemplateFromQuery();
      return;
    }

    const unsubscribe = persistApi.onFinishHydration(() => {
      applyTemplateFromQuery();
    });

    return () => {
      unsubscribe?.();
    };
  }, [searchParams, setTemplate, setLayout, resetDraft]);

  const applyTemplate = (nextTemplate: ResumeTemplate) => {
    setTemplate(nextTemplate);
    setLayout(TEMPLATE_LAYOUT_PRESETS[nextTemplate]);
    const resolvedLogo = resolveDefaultLogo(nextTemplate, data.collegeName);
    if (resolvedLogo) {
      updateRootField("logoDataUrl", resolvedLogo);
    }
  };

  useEffect(() => {
    const resolvedLogo = resolveDefaultLogo(safeTemplate, data.collegeName);
    if (!resolvedLogo) return;
    if (data.logoDataUrl !== resolvedLogo) {
      updateRootField("logoDataUrl", resolvedLogo);
    }
  }, [safeTemplate, data.collegeName, data.logoDataUrl, updateRootField]);

  const skillsText = useMemo(() => data.skills.join(", "), [data.skills]);
  const certText = useMemo(() => data.certifications.join("\n"), [data.certifications]);
  const positionsText = useMemo(() => data.positions.join("\n"), [data.positions]);
  const caArticleshipText = useMemo(() => data.caArticleship.join("\n"), [data.caArticleship]);
  const caAuditText = useMemo(() => data.caAuditExperience.join("\n"), [data.caAuditExperience]);
  const caTaxText = useMemo(() => data.caTaxationAndCompliance.join("\n"), [data.caTaxationAndCompliance]);
  const caToolsText = useMemo(() => data.caTools.join("\n"), [data.caTools]);
  const resumeHealth = useMemo(() => computeResumeHealth(data), [data]);
  const collegeOptions = TEMPLATE_COLLEGE_OPTIONS[safeTemplate] ?? [];

  useEffect(() => {
    setSkillsInput(skillsText);
  }, [skillsText]);

  const callImprove = async (payload: { mode: "experience" | "summary" | "grammar" | "recruiter"; input: string }) => {
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

      const maxPdfBytes = 2 * 1024 * 1024;
      const allowMultiPage = safeTemplate === "ca-professional";
      const exportHeight = allowMultiPage ? Math.max(1122, source.scrollHeight) : 1122;
      const exportNode = source.cloneNode(true) as HTMLDivElement;
      exportNode.style.width = "794px";
      exportNode.style.minHeight = `${exportHeight}px`;
      exportNode.style.maxHeight = allowMultiPage ? "none" : `${exportHeight}px`;
      exportNode.style.overflow = allowMultiPage ? "visible" : "hidden";
      exportNode.style.padding = "28px 30px";
      exportNode.style.margin = "0";
      exportNode.style.borderRadius = "0";
      exportNode.style.border = "0";
      exportNode.style.transform = "none";
      exportNode.style.boxShadow = "none";
      exportNode.style.position = "fixed";
      exportNode.style.left = "-10000px";
      exportNode.style.top = "0";
      exportNode.style.zIndex = "-1";

      document.body.appendChild(exportNode);

      let baseCanvas: HTMLCanvasElement;
      try {
        baseCanvas = await html2canvas(exportNode, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          width: 794,
          height: exportHeight,
          scrollX: 0,
          scrollY: 0,
        });
      } finally {
        document.body.removeChild(exportNode);
      }

      const downscaleSteps = [1, 0.92, 0.85, 0.78, 0.7, 0.62, 0.55];
      const qualitySteps = [0.82, 0.76, 0.7, 0.64, 0.58, 0.52, 0.45];

      let selectedPdf: jsPDF | null = null;
      let selectedSize = Number.POSITIVE_INFINITY;

      for (let index = 0; index < downscaleSteps.length; index += 1) {
        const ratio = downscaleSteps[index];
        const quality = qualitySteps[index];

        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = Math.max(1, Math.round(baseCanvas.width * ratio));
        exportCanvas.height = Math.max(1, Math.round(baseCanvas.height * ratio));

        const context = exportCanvas.getContext("2d");
        if (!context) {
          throw new Error("Failed to initialize PDF canvas context");
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        context.drawImage(baseCanvas, 0, 0, exportCanvas.width, exportCanvas.height);

        const imageData = exportCanvas.toDataURL("image/jpeg", quality);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
          compress: true,
        });

        if (allowMultiPage) {
          const pageWidth = 595.28;
          const pageHeight = 841.89;
          const imageHeight = (exportCanvas.height * pageWidth) / exportCanvas.width;

          let heightLeft = imageHeight;
          let position = 0;

          pdf.addImage(imageData, "JPEG", 0, position, pageWidth, imageHeight, undefined, "FAST");
          heightLeft -= pageHeight;

          while (heightLeft > 0) {
            position = heightLeft - imageHeight;
            pdf.addPage();
            pdf.addImage(imageData, "JPEG", 0, position, pageWidth, imageHeight, undefined, "FAST");
            heightLeft -= pageHeight;
          }
        } else {
          pdf.addImage(imageData, "JPEG", 0, 0, 595.28, 841.89, undefined, "FAST");
        }
        const blob = pdf.output("blob");

        if (blob.size < selectedSize) {
          selectedPdf = pdf;
          selectedSize = blob.size;
        }

        if (blob.size <= maxPdfBytes) {
          selectedPdf = pdf;
          selectedSize = blob.size;
          break;
        }
      }

      if (!selectedPdf) {
        throw new Error("Unable to generate PDF");
      }

      if (selectedSize > maxPdfBytes) {
        throw new Error("Could not generate a PDF under 2 MB. Reduce logo resolution or trim content and try again.");
      }

      selectedPdf.save(`${(data.name || "resume").replace(/\s+/g, "-").toLowerCase()}.pdf`);
      const finalSizeMb = (selectedSize / (1024 * 1024)).toFixed(2);
      setMessage(`PDF generated at ${finalSizeMb} MB.`);
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

  const runRecruiterSimulation = async () => {
    const context = recruiterContext.trim();
    const resumeText = getResumePlainText(data);
    const promptInput = context
      ? `Target role/context: ${context}\n\n${resumeText}`
      : `Target role/context: General software internship\n\n${resumeText}`;

    const value = await callImprove({ mode: "recruiter", input: promptInput });
    if (!value) return;
    setRecruiterResult(value);
  };

  const copyResumeText = async () => {
    try {
      const text = getResumePlainText(data);
      await navigator.clipboard.writeText(text);
      setMessage("Resume text copied.");
    } catch {
      setMessage("Could not copy to clipboard.");
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

          <TemplateSelector value={safeTemplate} onChange={applyTemplate} />

          <FormSection title="Resume Quality Score">
            <div className="rounded border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">Current Score</span>
                <span className="text-sm font-bold text-indigo-700">{resumeHealth.score}/100</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded bg-slate-200">
                <div
                  className="h-full rounded bg-indigo-600 transition-all"
                  style={{ width: `${Math.max(6, resumeHealth.score)}%` }}
                />
              </div>

              {resumeHealth.warnings.length > 0 && (
                <div className="mt-3 rounded border border-amber-200 bg-amber-50 p-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-800">Improve Next</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-amber-900">
                    {resumeHealth.warnings.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-3 rounded border border-emerald-200 bg-emerald-50 p-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-emerald-800">Strengths</h3>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-emerald-900">
                  {resumeHealth.positives.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </FormSection>

          <FormSection title="Recruiter Simulation Score">
            <p className="text-xs text-slate-600">
              30-second recruiter screen with shortlist decision, top concerns, and fast fixes.
            </p>
            <textarea
              className="mt-2 h-16 w-full rounded border border-gray-300 px-3 py-2 text-sm"
              placeholder="Optional target role/context (e.g., SDE Intern, Backend Engineer)"
              value={recruiterContext}
              onChange={(event) => setRecruiterContext(event.target.value)}
            />
            <AIButton label="Run Recruiter Simulation" loading={loadingKey.startsWith("recruiter")} onClick={runRecruiterSimulation} />
            {recruiterResult && <pre className="whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs leading-5">{recruiterResult}</pre>}
          </FormSection>

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
            {collegeOptions.length > 0 && (
              <label className="block text-xs font-medium text-slate-700">
                College name
                <select
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  value={data.collegeName}
                  onChange={(event) => updateRootField("collegeName", event.target.value)}
                >
                  <option value="">Select college</option>
                  {collegeOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            )}
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
              value={skillsInput}
              onChange={(event) => setSkillsInput(event.target.value)}
              onBlur={(event) => updateSkillsFromText(event.target.value)}
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

          {safeTemplate === "ca-professional" && (
            <FormSection title="CA Domain Sections">
              <textarea
                className="h-16 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="Articleship highlights (one line per entry)"
                value={caArticleshipText}
                onChange={(event) => updateSimpleListFromText("caArticleship", event.target.value)}
              />
              <textarea
                className="h-16 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="Audit / assurance assignments (one line per entry)"
                value={caAuditText}
                onChange={(event) => updateSimpleListFromText("caAuditExperience", event.target.value)}
              />
              <textarea
                className="h-16 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="Taxation & compliance work (one line per entry)"
                value={caTaxText}
                onChange={(event) => updateSimpleListFromText("caTaxationAndCompliance", event.target.value)}
              />
              <textarea
                className="h-16 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                placeholder="Tools (Tally, Excel, SAP, Zoho, etc.) - one per line"
                value={caToolsText}
                onChange={(event) => updateSimpleListFromText("caTools", event.target.value)}
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
            <button className="rounded border border-slate-300 px-3 py-2 text-xs text-slate-700" onClick={copyResumeText}>
              Copy Text
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
              Font family
              <select
                className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs"
                value={layout.fontStyle ?? "serif-pro"}
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
            <ResumePreview data={debouncedData} layout={layout} template={safeTemplate} ref={previewRef} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Builder;
