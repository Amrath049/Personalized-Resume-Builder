// Convenience selectors for components.

import { useStore } from './store';
import type { Resume } from '../types';

/** The resume currently being edited (master or active version). */
export function useCurrentResume(): Resume {
  return useStore((s) =>
    s.editingId === null ? s.master : s.versions.find((v) => v.id === s.editingId)?.resume ?? s.master,
  );
}
