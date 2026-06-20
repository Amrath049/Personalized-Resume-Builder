// Global state: master resume, named versions, settings, filename.
// Persisted to localStorage via zustand's persist middleware.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistedState, Resume, SavedVersion, Settings, SectionId, SectionConfig } from '../types';
import {
  DEFAULT_FILENAME,
  DEFAULT_SETTINGS,
  MASTER_RESUME,
  SEED_VERSIONS,
} from '../data/seed';
import { TEMPLATES, DEFAULT_SECTION_CONFIG } from '../data/templates';

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'id-' + Math.floor(Math.random() * 1e9).toString(36) + Date.now().toString(36);
}

interface StoreActions {
  /** The resume currently being edited (master or the active version). */
  getCurrent: () => Resume;
  /** Apply an in-place mutation to the current resume (immutably persisted). */
  editResume: (mutate: (r: Resume) => void) => void;
  /** Replace the whole current resume (used by AI "apply"). */
  setCurrentResume: (r: Resume) => void;

  setEditing: (id: string | null) => void;
  saveAsVersion: (name: string) => void;
  duplicateVersion: (id: string) => void;
  renameVersion: (id: string, name: string) => void;
  deleteVersion: (id: string) => void;

  setFilename: (name: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
  applyTemplate: (id: string) => void;
  setSectionConfig: (key: SectionId, patch: Partial<SectionConfig>) => void;

  exportData: () => PersistedState;
  importData: (data: PersistedState) => void;
  resetAll: () => void;
}

export type Store = PersistedState & StoreActions;

function currentOf(s: PersistedState): Resume {
  if (s.editingId === null) return s.master;
  return s.versions.find((v) => v.id === s.editingId)?.resume ?? s.master;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      master: MASTER_RESUME,
      versions: SEED_VERSIONS,
      editingId: null,
      settings: DEFAULT_SETTINGS,
      filename: DEFAULT_FILENAME,

      getCurrent: () => currentOf(get()),

      editResume: (mutate) =>
        set((s) => {
          if (s.editingId === null) {
            const r = structuredClone(s.master);
            mutate(r);
            return { master: r };
          }
          const versions = s.versions.map((v) => {
            if (v.id !== s.editingId) return v;
            const r = structuredClone(v.resume);
            mutate(r);
            return { ...v, resume: r, updatedAt: Date.now() };
          });
          return { versions };
        }),

      setCurrentResume: (r) =>
        set((s) => {
          if (s.editingId === null) return { master: structuredClone(r) };
          const versions = s.versions.map((v) =>
            v.id === s.editingId ? { ...v, resume: structuredClone(r), updatedAt: Date.now() } : v,
          );
          return { versions };
        }),

      setEditing: (id) => set({ editingId: id }),

      saveAsVersion: (name) =>
        set((s) => {
          const cur = currentOf(s);
          const v: SavedVersion = {
            id: uid(),
            name: name.trim() || 'Untitled version',
            updatedAt: Date.now(),
            resume: structuredClone(cur),
          };
          return { versions: [...s.versions, v], editingId: v.id };
        }),

      duplicateVersion: (id) =>
        set((s) => {
          const src = id === null ? s.master : s.versions.find((v) => v.id === id)?.resume;
          if (!src) return {};
          const base = s.versions.find((v) => v.id === id);
          const v: SavedVersion = {
            id: uid(),
            name: (base ? base.name : 'Master') + ' (copy)',
            updatedAt: Date.now(),
            resume: structuredClone(src),
          };
          return { versions: [...s.versions, v], editingId: v.id };
        }),

      renameVersion: (id, name) =>
        set((s) => ({
          versions: s.versions.map((v) => (v.id === id ? { ...v, name: name.trim() || v.name } : v)),
        })),

      deleteVersion: (id) =>
        set((s) => ({
          versions: s.versions.filter((v) => v.id !== id),
          editingId: s.editingId === id ? null : s.editingId,
        })),

      setFilename: (name) => set({ filename: name }),

      setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      applyTemplate: (id) =>
        set((s) => {
          const preset = TEMPLATES.find((t) => t.id === id);
          if (!preset) return {};
          return { settings: { ...s.settings, templateId: id, sectionOverrides: preset.sections } };
        }),

      setSectionConfig: (key, patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            sectionOverrides: {
              ...s.settings.sectionOverrides,
              [key]: { ...s.settings.sectionOverrides[key], ...patch },
            },
          },
        })),

      exportData: () => {
        const s = get();
        return {
          master: s.master,
          versions: s.versions,
          editingId: s.editingId,
          settings: s.settings,
          filename: s.filename,
        };
      },

      importData: (data) =>
        set(() => ({
          master: data.master ?? MASTER_RESUME,
          versions: data.versions ?? [],
          editingId: data.editingId ?? null,
          settings: {
            ...DEFAULT_SETTINGS,
            ...(data.settings ?? {}),
            sectionOverrides: {
              ...DEFAULT_SECTION_CONFIG,
              ...(data.settings?.sectionOverrides ?? {}),
            },
          },
          filename: data.filename ?? DEFAULT_FILENAME,
        })),

      resetAll: () =>
        set({
          master: structuredClone(MASTER_RESUME),
          versions: structuredClone(SEED_VERSIONS),
          editingId: null,
          settings: DEFAULT_SETTINGS,
          filename: DEFAULT_FILENAME,
        }),
    }),
    {
      name: 'resumetailor-store',
      version: 1,
      migrate: (persisted: unknown) => {
        const p = persisted as { settings?: Partial<Settings> };
        if (!p.settings?.sectionOverrides) {
          p.settings = { ...p.settings, templateId: 'tech', sectionOverrides: DEFAULT_SECTION_CONFIG };
        }
        return p;
      },
      partialize: (s) => ({
        master: s.master,
        versions: s.versions,
        editingId: s.editingId,
        settings: s.settings,
        filename: s.filename,
      }),
    },
  ),
);

// ---- factories for "Add" buttons ----
export const emptyExperience = () => ({ role: '', company: '', dateRange: '', bullets: [''] });
export const emptyProject = () => ({ name: '', techStack: '', bullets: [''] });
export const emptySkill = () => ({ label: '', value: '' });
export const emptyEducation = () => ({ degree: '', institution: '', detail: '' });
export const emptyCourse = () => ({ title: '', provider: '', detail: '' });
