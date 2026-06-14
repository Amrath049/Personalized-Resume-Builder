import { useState } from 'react';
import { VersionsBar } from './versions/VersionsBar';
import { Editor } from './editor/Editor';
import { JdAssistant } from './jd/JdAssistant';
import { Settings } from './Settings';
import { PreviewPane } from './preview/PreviewPane';

type Tab = 'edit' | 'jd' | 'settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('edit');

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="logo">📄</span>
          <div>
            <h1>ResumeTailor</h1>
            <span className="tagline">Tailor your resume to each JD &amp; download an ATS-friendly PDF</span>
          </div>
        </div>
        <VersionsBar />
      </header>

      <main className="layout">
        <div className="left">
          <nav className="tabs">
            <button className={tab === 'edit' ? 'tab active' : 'tab'} onClick={() => setTab('edit')}>
              Edit resume
            </button>
            <button className={tab === 'jd' ? 'tab active' : 'tab'} onClick={() => setTab('jd')}>
              JD Assistant
            </button>
            <button className={tab === 'settings' ? 'tab active' : 'tab'} onClick={() => setTab('settings')}>
              Settings
            </button>
          </nav>
          <div className="left-scroll">
            {tab === 'edit' && <Editor />}
            {tab === 'jd' && <JdAssistant />}
            {tab === 'settings' && <Settings />}
          </div>
        </div>

        <div className="right">
          <PreviewPane />
        </div>
      </main>
    </div>
  );
}
