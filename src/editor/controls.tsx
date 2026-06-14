// Small reusable form controls used across the section editors.

import type { ReactNode } from 'react';

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input className="text-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      className="text-area"
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function ItemControls({
  onUp,
  onDown,
  onDelete,
  canUp,
  canDown,
}: {
  onUp: () => void;
  onDown: () => void;
  onDelete: () => void;
  canUp: boolean;
  canDown: boolean;
}) {
  return (
    <div className="item-controls">
      <button className="icon-btn" title="Move up" disabled={!canUp} onClick={onUp}>
        ↑
      </button>
      <button className="icon-btn" title="Move down" disabled={!canDown} onClick={onDown}>
        ↓
      </button>
      <button className="icon-btn danger" title="Delete" onClick={onDelete}>
        ✕
      </button>
    </div>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button className="add-btn" onClick={onClick}>
      + {children}
    </button>
  );
}

export function Card({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="card">
      <div className="card-head">
        <h3>{title}</h3>
        {actions}
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}

// Generic array helpers (immutable).
export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [it] = copy.splice(from, 1);
  copy.splice(to, 0, it);
  return copy;
}
