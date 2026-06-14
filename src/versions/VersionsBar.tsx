// Top bar: switch between master/versions, save-as, duplicate, rename, delete,
// and export/import the whole dataset as a JSON file.

import { useRef } from 'react';
import { saveAs } from 'file-saver';
import { useStore } from '../store/store';
import type { PersistedState } from '../types';

export function VersionsBar() {
  const versions = useStore((s) => s.versions);
  const editingId = useStore((s) => s.editingId);
  const setEditing = useStore((s) => s.setEditing);
  const saveAsVersion = useStore((s) => s.saveAsVersion);
  const duplicateVersion = useStore((s) => s.duplicateVersion);
  const renameVersion = useStore((s) => s.renameVersion);
  const deleteVersion = useStore((s) => s.deleteVersion);
  const exportData = useStore((s) => s.exportData);
  const importData = useStore((s) => s.importData);

  const fileRef = useRef<HTMLInputElement>(null);

  const onSaveAs = () => {
    const name = window.prompt('Name this version (e.g. the company name):', 'New Company');
    if (name) saveAsVersion(name);
  };

  const onRename = () => {
    if (!editingId) return;
    const cur = versions.find((v) => v.id === editingId);
    const name = window.prompt('Rename version:', cur?.name ?? '');
    if (name && editingId) renameVersion(editingId, name);
  };

  const onDelete = () => {
    if (!editingId) return;
    const cur = versions.find((v) => v.id === editingId);
    if (window.confirm(`Delete version "${cur?.name}"? This cannot be undone.`)) deleteVersion(editingId);
  };

  const onExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, 'resumetailor-backup.json');
  };

  const onImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result)) as PersistedState;
        importData(data);
        window.alert('Import successful.');
      } catch {
        window.alert('That file is not a valid ResumeTailor backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="versions-bar">
      <span className="vb-label">Version:</span>
      <select
        className="vb-select"
        value={editingId ?? 'master'}
        onChange={(e) => setEditing(e.target.value === 'master' ? null : e.target.value)}
      >
        <option value="master">★ Master</option>
        {versions.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      <button className="btn btn-small" onClick={onSaveAs} title="Save current as a new named version">
        Save as…
      </button>
      <button className="btn btn-small" onClick={() => duplicateVersion(editingId ?? '')} title="Duplicate current">
        Duplicate
      </button>
      <button className="btn btn-small" onClick={onRename} disabled={!editingId}>
        Rename
      </button>
      <button className="btn btn-small danger" onClick={onDelete} disabled={!editingId}>
        Delete
      </button>

      <span className="vb-spacer" />

      <button className="btn btn-small" onClick={onExport} title="Download a JSON backup">
        Export
      </button>
      <button className="btn btn-small" onClick={() => fileRef.current?.click()} title="Restore from a JSON backup">
        Import
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onImportFile(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}
