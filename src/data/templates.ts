import type { SectionId, SectionConfig } from '../types';

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  sections: Record<SectionId, SectionConfig>;
}

export const DEFAULT_SECTION_CONFIG: Record<SectionId, SectionConfig> = {
  summary:    { enabled: true,  label: 'Professional Summary' },
  experience: { enabled: true,  label: 'Experience' },
  projects:   { enabled: true,  label: 'Projects',                  sublabel: 'Tech Stack' },
  skills:     { enabled: true,  label: 'Skills' },
  education:  { enabled: true,  label: 'Education' },
  courses:    { enabled: true,  label: 'Courses and Certificates' },
};

export const TEMPLATES: TemplatePreset[] = [
  {
    id: 'tech',
    name: 'Software / Tech',
    description: 'Engineers, developers, data scientists, DevOps',
    sections: DEFAULT_SECTION_CONFIG,
  },
  {
    id: 'marketing',
    name: 'Marketing & Sales',
    description: 'Marketers, growth managers, account executives, sales',
    sections: {
      summary:    { enabled: true,  label: 'Professional Summary' },
      experience: { enabled: true,  label: 'Experience' },
      projects:   { enabled: true,  label: 'Campaigns & Wins',         sublabel: 'Tools & Channels' },
      skills:     { enabled: true,  label: 'Skills & Competencies' },
      education:  { enabled: true,  label: 'Education' },
      courses:    { enabled: true,  label: 'Certifications & Training' },
    },
  },
  {
    id: 'design',
    name: 'Design & Creative',
    description: 'UX/UI designers, graphic designers, art directors',
    sections: {
      summary:    { enabled: true,  label: 'Profile' },
      experience: { enabled: true,  label: 'Experience' },
      projects:   { enabled: true,  label: 'Portfolio',               sublabel: 'Tools & Software' },
      skills:     { enabled: true,  label: 'Skills' },
      education:  { enabled: true,  label: 'Education' },
      courses:    { enabled: false, label: 'Training & Development' },
    },
  },
  {
    id: 'general',
    name: 'General / Other',
    description: 'Any field — customize sections freely below',
    sections: {
      summary:    { enabled: true,  label: 'Professional Summary' },
      experience: { enabled: true,  label: 'Experience' },
      projects:   { enabled: false, label: 'Key Projects' },
      skills:     { enabled: true,  label: 'Skills' },
      education:  { enabled: true,  label: 'Education' },
      courses:    { enabled: false, label: 'Certifications' },
    },
  },
];
