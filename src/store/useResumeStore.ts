import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ResumeTemplate = "jake" | "classic-logo" | "table-edu" | "modern-clean";
export type ResumeFontStyle = "latex" | "classic" | "modern";

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
};

type LayoutSettings = {
  fontSize: number;
  lineHeight: number;
  sectionGap: number;
  itemGap: number;
  fontStyle: ResumeFontStyle;
};

type ResumeStore = {
  template: ResumeTemplate;
  data: ResumeData;
  layout: LayoutSettings;
  setTemplate: (template: ResumeTemplate) => void;
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
  updateSimpleListFromText: (field: "certifications" | "positions", value: string) => void;
  setLayout: (partial: Partial<LayoutSettings> | ((prev: LayoutSettings) => Partial<LayoutSettings>)) => void;
  resetLayout: () => void;
};

const makeId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const defaultLayout: LayoutSettings = {
  fontSize: 13.8,
  lineHeight: 1.52,
  sectionGap: 12,
  itemGap: 6,
  fontStyle: "latex",
};

const defaultData: ResumeData = {
  name: "",
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
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      template: "jake",
      data: defaultData,
      layout: defaultLayout,
  setTemplate: (template) => set({ template }),
  updateRootField: (field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        [field]: value,
      },
    })),
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
    {
      name: "resume-sutra-draft-v1",
      partialize: (state) => ({
        template: state.template,
        data: state.data,
        layout: state.layout,
      }),
    },
  ),
);
