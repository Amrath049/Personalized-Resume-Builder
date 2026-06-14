// Core data model for ResumeTailor.

export interface Header {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string; // e.g. "linkedin.com/in/amrath-prasad-99234a209"
  github: string; // e.g. "github.com/Amrath049"
}

export interface ExperienceItem {
  role: string;
  company: string;
  dateRange: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  techStack: string;
  bullets: string[];
}

export interface SkillItem {
  label: string;
  value: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  detail: string;
}

export interface CourseItem {
  title: string;
  provider: string;
  detail: string;
}

export interface Resume {
  header: Header;
  summary: string;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  education: EducationItem[];
  courses: CourseItem[];
}

export type AiProvider = 'gemini' | 'groq';
export type PageSize = 'A4' | 'LETTER';

export interface Settings {
  pageSize: PageSize;
  fontScale: number; // 1 = default; lets you nudge everything to fit one page
  aiProvider: AiProvider;
  geminiKey: string;
  geminiModel: string;
  groqKey: string;
  groqModel: string;
  proxyUrl: string; // optional Node proxy base URL (used if a provider blocks browser calls)
}

export interface SavedVersion {
  id: string;
  name: string;
  updatedAt: number;
  resume: Resume;
}

// The shape that is persisted and that export/import reads/writes.
export interface PersistedState {
  master: Resume;
  versions: SavedVersion[];
  editingId: string | null; // null = editing the master
  settings: Settings;
  filename: string;
}
