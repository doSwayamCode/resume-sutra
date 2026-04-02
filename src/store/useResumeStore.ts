
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SectionKey =
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

export type ResumeTemplate =
  | "jake"
  | "classic-logo"
  | "table-edu"
  | "modern-clean"
  | "dtu-placement"
  | "nsut-placement"
  | "iit-placement"
  | "nit-placement"
  | "iiit-placement"
  | "iisc-academic"
  | "igdtuw-placement"
  | "bits-placement"
  | "iim-management"
  | "ggsipu-placement"
  | "ca-professional";
export type ResumeFontStyle = "latex" | "classic" | "modern" | "serif-pro" | "executive" | "clean-sans";

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  details: string;
  startDate: string;
  endDate: string;
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type ProjectItem = {
  id: string;
  name: string;
  tech: string;
  link: string;
  bullets: string[];
};

export type AchievementItem = {
  id: string;
  title: string;
  details: string;
};

export type ResumeData = {
  name: string;
  collegeName: string;
  email: string;
  phone: string;
  location: string;
  links: string;
  logoDataUrl: string;
  logoSize: number;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: string[];
  achievements: AchievementItem[];
  certifications: string[];
  positions: string[];
  caArticleship: string[];
  caAuditExperience: string[];
  caTaxationAndCompliance: string[];
  caTools: string[];
};

type LayoutSettings = {
  fontSize: number;
  lineHeight: number;
  sectionGap: number;
  itemGap: number;
  fontStyle: ResumeFontStyle;
};

type ResumeStore = {
    hiddenSections: SectionKey[];
    hideSection: (key: SectionKey) => void;
    showSection: (key: SectionKey) => void;
  template: ResumeTemplate;
  data: ResumeData;
  layout: LayoutSettings;
  setTemplate: (template: ResumeTemplate) => void;
  setData: (data: ResumeData) => void;
  updateRootField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, field: keyof EducationItem, value: string) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateExperienceField: (id: string, field: Exclude<keyof ExperienceItem, "bullets" | "id">, value: string) => void;
  updateExperienceBullet: (id: string, index: number, value: string) => void;
  setExperienceBullets: (id: string, bullets: string[]) => void;
  addExperienceBullet: (id: string) => void;
  removeExperienceBullet: (id: string, index: number) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  updateProjectField: (id: string, field: Exclude<keyof ProjectItem, "bullets" | "id">, value: string) => void;
  updateProjectBullet: (id: string, index: number, value: string) => void;
  setProjectBullets: (id: string, bullets: string[]) => void;
  addProjectBullet: (id: string) => void;
  removeProjectBullet: (id: string, index: number) => void;
  addAchievement: () => void;
  removeAchievement: (id: string) => void;
  updateAchievement: (id: string, field: keyof AchievementItem, value: string) => void;
  updateSkillsFromText: (value: string) => void;
  updateSimpleListFromText: (
    field: "certifications" | "positions" | "caArticleship" | "caAuditExperience" | "caTaxationAndCompliance" | "caTools",
    value: string,
  ) => void;
  setLayout: (partial: Partial<LayoutSettings> | ((prev: LayoutSettings) => Partial<LayoutSettings>)) => void;
  resetLayout: () => void;
  resetDraft: () => void;
};

const makeId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const defaultLayout: LayoutSettings = {
  fontSize: 12.8,
  lineHeight: 1.34,
  sectionGap: 9,
  itemGap: 4,
  fontStyle: "serif-pro",
};

const defaultData: ResumeData = {
  name: "",
  collegeName: "",
  email: "",
  phone: "",
  location: "",
  links: "",
  logoDataUrl: "",
  logoSize: 84,
  summary: "",
  education: [],
  experience: [],
  projects: [],
  skills: [],
  achievements: [],
  certifications: [],
  positions: [],
  caArticleship: [],
  caAuditExperience: [],
  caTaxationAndCompliance: [],
  caTools: [],
};



const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const toStringValue = (value: unknown): string => (typeof value === "string" ? value : "");

const toStringArray = (value: unknown): string[] => (Array.isArray(value) ? value.map((item) => String(item ?? "")) : []);



const normalizeEducation = (value: unknown): EducationItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => ({
      id: toStringValue(item.id) || makeId(),
      school: toStringValue(item.school),
      degree: toStringValue(item.degree),
      details: toStringValue(item.details),
      startDate: toStringValue(item.startDate),
      endDate: toStringValue(item.endDate),
    }));
};

const normalizeExperience = (value: unknown): ExperienceItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => ({
      id: toStringValue(item.id) || makeId(),
      role: toStringValue(item.role),
      company: toStringValue(item.company),
      startDate: toStringValue(item.startDate),
      endDate: toStringValue(item.endDate),
      bullets: toStringArray(item.bullets),
    }));
};

const normalizeProjects = (value: unknown): ProjectItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => ({
      id: toStringValue(item.id) || makeId(),
      name: toStringValue(item.name),
      tech: toStringValue(item.tech),
      link: toStringValue(item.link),
      bullets: toStringArray(item.bullets),
    }));
};

const normalizeAchievements = (value: unknown): AchievementItem[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isRecord)
    .map((item) => ({
      id: toStringValue(item.id) || makeId(),
      title: toStringValue(item.title),
      details: toStringValue(item.details),
    }));
};

const normalizeResumeData = (value: unknown): ResumeData => {
  const raw = isRecord(value) ? value : {};
  const logoSizeRaw = typeof raw.logoSize === "number" && Number.isFinite(raw.logoSize) ? raw.logoSize : defaultData.logoSize;

  return {
    name: toStringValue(raw.name),
    collegeName: toStringValue(raw.collegeName),
    email: toStringValue(raw.email),
    phone: toStringValue(raw.phone),
    location: toStringValue(raw.location),
    links: toStringValue(raw.links),
    logoDataUrl: toStringValue(raw.logoDataUrl),
    logoSize: Math.max(48, Math.min(200, logoSizeRaw)),
    summary: toStringValue(raw.summary),
    education: normalizeEducation(raw.education),
    experience: normalizeExperience(raw.experience),
    projects: normalizeProjects(raw.projects),
    skills: toStringArray(raw.skills),
    achievements: normalizeAchievements(raw.achievements),
    certifications: toStringArray(raw.certifications),
    positions: toStringArray(raw.positions),
    caArticleship: toStringArray(raw.caArticleship),
    caAuditExperience: toStringArray(raw.caAuditExperience),
    caTaxationAndCompliance: toStringArray(raw.caTaxationAndCompliance),
    caTools: toStringArray(raw.caTools),
  };
};


export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      template: "jake",
      data: defaultData,
      layout: defaultLayout,
      hiddenSections: [],
      setTemplate: (template) => set({ template }),
      setData: (data) => set({ data: normalizeResumeData(data) }),
      resetDraft: () => set({ data: defaultData, layout: defaultLayout, hiddenSections: [] }),
      updateRootField: (field, value) =>
        set((state) => ({
          data: {
            ...state.data,
            [field]: value,
          },
        })),
      hideSection: (key: SectionKey) => set((state) => ({ hiddenSections: Array.from(new Set([...state.hiddenSections, key])) })),
      showSection: (key: SectionKey) => set((state) => ({ hiddenSections: state.hiddenSections.filter((k) => k !== key) })),
        addEducation: () =>
          set((state) => ({
            data: {
              ...state.data,
              education: [
                ...state.data.education,
                {
                  id: makeId(),
                  school: "",
                  degree: "",
                  details: "",
                  startDate: "",
                  endDate: "",
                },
              ],
            },
          })),
        removeEducation: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              education: state.data.education.filter((item) => item.id !== id),
            },
          })),
        updateEducation: (id, field, value) =>
          set((state) => ({
            data: {
              ...state.data,
              education: state.data.education.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      [field]: value,
                    }
                  : item,
              ),
            },
          })),
        addExperience: () =>
          set((state) => ({
            data: {
              ...state.data,
              experience: [
                ...state.data.experience,
                {
                  id: makeId(),
                  role: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                  bullets: [""],
                },
              ],
            },
          })),
        removeExperience: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              experience: state.data.experience.filter((item) => item.id !== id),
            },
          })),
        updateExperienceField: (id, field, value) =>
          set((state) => ({
            data: {
              ...state.data,
              experience: state.data.experience.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      [field]: value,
                    }
                  : item,
              ),
            },
          })),
        updateExperienceBullet: (id, index, value) =>
          set((state) => ({
            data: {
              ...state.data,
              experience: state.data.experience.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      bullets: item.bullets.map((bullet, bulletIndex) => (bulletIndex === index ? value : bullet)),
                    }
                  : item,
              ),
            },
          })),
        setExperienceBullets: (id, bullets) =>
          set((state) => ({
            data: {
              ...state.data,
              experience: state.data.experience.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      bullets: bullets.slice(0, 4),
                    }
                  : item,
              ),
            },
          })),
        addExperienceBullet: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              experience: state.data.experience.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      bullets: [...item.bullets, ""],
                    }
                  : item,
              ),
            },
          })),
        removeExperienceBullet: (id, index) =>
          set((state) => ({
            data: {
              ...state.data,
              experience: state.data.experience.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      bullets: item.bullets.filter((_, bulletIndex) => bulletIndex !== index),
                    }
                  : item,
              ),
            },
          })),
        addProject: () =>
          set((state) => ({
            data: {
              ...state.data,
              projects: [
                ...state.data.projects,
                {
                  id: makeId(),
                  name: "",
                  tech: "",
                  link: "",
                  bullets: [""],
                },
              ],
            },
          })),
        removeProject: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              projects: state.data.projects.filter((item) => item.id !== id),
            },
          })),
        updateProjectField: (id, field, value) =>
          set((state) => ({
            data: {
              ...state.data,
              projects: state.data.projects.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      [field]: value,
                    }
                  : item,
              ),
            },
          })),
        updateProjectBullet: (id, index, value) =>
          set((state) => ({
            data: {
              ...state.data,
              projects: state.data.projects.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      bullets: item.bullets.map((bullet, bulletIndex) => (bulletIndex === index ? value : bullet)),
                    }
                  : item,
              ),
            },
          })),
        setProjectBullets: (id, bullets) =>
          set((state) => ({
            data: {
              ...state.data,
              projects: state.data.projects.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      bullets: bullets.slice(0, 4),
                    }
                  : item,
              ),
            },
          })),
        addProjectBullet: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              projects: state.data.projects.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      bullets: [...item.bullets, ""],
                    }
                  : item,
              ),
            },
          })),
        removeProjectBullet: (id, index) =>
          set((state) => ({
            data: {
              ...state.data,
              projects: state.data.projects.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      bullets: item.bullets.filter((_, bulletIndex) => bulletIndex !== index),
                    }
                  : item,
              ),
            },
          })),
        addAchievement: () =>
          set((state) => ({
            data: {
              ...state.data,
              achievements: [...state.data.achievements, { id: makeId(), title: "", details: "" }],
            },
          })),
        removeAchievement: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              achievements: state.data.achievements.filter((item) => item.id !== id),
            },
          })),
        updateAchievement: (id, field, value) =>
          set((state) => ({
            data: {
              ...state.data,
              achievements: state.data.achievements.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      [field]: value,
                    }
                  : item,
              ),
            },
          })),
        updateSkillsFromText: (value) =>
          set((state) => ({
            data: {
              ...state.data,
              skills: value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            },
          })),
        updateSimpleListFromText: (field, value) =>
          set((state) => ({
            data: {
              ...state.data,
              [field]: value
                .split("\n")
                .map((item) => item.trim())
                .filter(Boolean),
            },
          })),
        setLayout: (partial) =>
          set((state) => ({
            layout: {
              ...state.layout,
              ...(typeof partial === "function" ? partial(state.layout) : partial),
            },
          })),
        resetLayout: () => set({ layout: defaultLayout }),
    }),
    { name: "resume-store" }
  )
);
