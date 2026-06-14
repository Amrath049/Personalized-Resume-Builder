// The form editor for all 7 resume sections.

import { useStore } from '../store/store';
import {
  emptyCourse,
  emptyEducation,
  emptyExperience,
  emptyProject,
  emptySkill,
} from '../store/store';
import { useCurrentResume } from '../store/hooks';
import { AddButton, Card, Field, ItemControls, TextArea, TextInput, moveItem } from './controls';

function BulletsEditor({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="bullets">
      <span className="field-label">Bullet points</span>
      {bullets.map((b, i) => (
        <div className="bullet-row" key={i}>
          <TextArea value={b} rows={2} placeholder="Achievement / responsibility…" onChange={(v) => {
            const next = [...bullets];
            next[i] = v;
            onChange(next);
          }} />
          <ItemControls
            canUp={i > 0}
            canDown={i < bullets.length - 1}
            onUp={() => onChange(moveItem(bullets, i, i - 1))}
            onDown={() => onChange(moveItem(bullets, i, i + 1))}
            onDelete={() => onChange(bullets.filter((_, j) => j !== i))}
          />
        </div>
      ))}
      <AddButton onClick={() => onChange([...bullets, ''])}>Add bullet</AddButton>
    </div>
  );
}

export function Editor() {
  const resume = useCurrentResume();
  const edit = useStore((s) => s.editResume);

  return (
    <div className="editor">
      {/* HEADER */}
      <Card title="Header">
        <Field label="Full name">
          <TextInput value={resume.header.name} onChange={(v) => edit((r) => (r.header.name = v))} />
        </Field>
        <Field label="Title / headline">
          <TextInput value={resume.header.title} onChange={(v) => edit((r) => (r.header.title = v))} />
        </Field>
        <div className="grid-2">
          <Field label="Location">
            <TextInput value={resume.header.location} onChange={(v) => edit((r) => (r.header.location = v))} />
          </Field>
          <Field label="Phone">
            <TextInput value={resume.header.phone} onChange={(v) => edit((r) => (r.header.phone = v))} />
          </Field>
          <Field label="Email">
            <TextInput value={resume.header.email} onChange={(v) => edit((r) => (r.header.email = v))} />
          </Field>
          <Field label="LinkedIn" hint="without https://">
            <TextInput value={resume.header.linkedin} onChange={(v) => edit((r) => (r.header.linkedin = v))} />
          </Field>
          <Field label="GitHub" hint="without https://">
            <TextInput value={resume.header.github} onChange={(v) => edit((r) => (r.header.github = v))} />
          </Field>
        </div>
      </Card>

      {/* SUMMARY */}
      <Card title="Professional Summary">
        <TextArea
          rows={5}
          value={resume.summary}
          placeholder="2–4 sentences tailored to the job…"
          onChange={(v) => edit((r) => (r.summary = v))}
        />
      </Card>

      {/* EXPERIENCE */}
      <Card
        title="Experience"
        actions={<AddButton onClick={() => edit((r) => r.experience.push(emptyExperience()))}>Add role</AddButton>}
      >
        {resume.experience.map((e, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-head">
              <strong>Role {i + 1}</strong>
              <ItemControls
                canUp={i > 0}
                canDown={i < resume.experience.length - 1}
                onUp={() => edit((r) => (r.experience = moveItem(r.experience, i, i - 1)))}
                onDown={() => edit((r) => (r.experience = moveItem(r.experience, i, i + 1)))}
                onDelete={() => edit((r) => r.experience.splice(i, 1))}
              />
            </div>
            <Field label="Role / title">
              <TextInput value={e.role} onChange={(v) => edit((r) => (r.experience[i].role = v))} />
            </Field>
            <div className="grid-2">
              <Field label="Company">
                <TextInput value={e.company} onChange={(v) => edit((r) => (r.experience[i].company = v))} />
              </Field>
              <Field label="Dates / location">
                <TextInput value={e.dateRange} onChange={(v) => edit((r) => (r.experience[i].dateRange = v))} />
              </Field>
            </div>
            <BulletsEditor bullets={e.bullets} onChange={(next) => edit((r) => (r.experience[i].bullets = next))} />
          </div>
        ))}
      </Card>

      {/* PROJECTS */}
      <Card
        title="Projects"
        actions={<AddButton onClick={() => edit((r) => r.projects.push(emptyProject()))}>Add project</AddButton>}
      >
        {resume.projects.map((p, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-head">
              <strong>Project {i + 1}</strong>
              <ItemControls
                canUp={i > 0}
                canDown={i < resume.projects.length - 1}
                onUp={() => edit((r) => (r.projects = moveItem(r.projects, i, i - 1)))}
                onDown={() => edit((r) => (r.projects = moveItem(r.projects, i, i + 1)))}
                onDelete={() => edit((r) => r.projects.splice(i, 1))}
              />
            </div>
            <Field label="Project name">
              <TextInput value={p.name} onChange={(v) => edit((r) => (r.projects[i].name = v))} />
            </Field>
            <Field label="Tech stack">
              <TextInput value={p.techStack} onChange={(v) => edit((r) => (r.projects[i].techStack = v))} />
            </Field>
            <BulletsEditor bullets={p.bullets} onChange={(next) => edit((r) => (r.projects[i].bullets = next))} />
          </div>
        ))}
      </Card>

      {/* SKILLS */}
      <Card
        title="Skills"
        actions={<AddButton onClick={() => edit((r) => r.skills.push(emptySkill()))}>Add skill line</AddButton>}
      >
        {resume.skills.map((sk, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-head">
              <strong>Line {i + 1}</strong>
              <ItemControls
                canUp={i > 0}
                canDown={i < resume.skills.length - 1}
                onUp={() => edit((r) => (r.skills = moveItem(r.skills, i, i - 1)))}
                onDown={() => edit((r) => (r.skills = moveItem(r.skills, i, i + 1)))}
                onDelete={() => edit((r) => r.skills.splice(i, 1))}
              />
            </div>
            <Field label="Category">
              <TextInput value={sk.label} onChange={(v) => edit((r) => (r.skills[i].label = v))} />
            </Field>
            <Field label="Skills (comma separated)">
              <TextArea rows={2} value={sk.value} onChange={(v) => edit((r) => (r.skills[i].value = v))} />
            </Field>
          </div>
        ))}
      </Card>

      {/* EDUCATION */}
      <Card
        title="Education"
        actions={<AddButton onClick={() => edit((r) => r.education.push(emptyEducation()))}>Add education</AddButton>}
      >
        {resume.education.map((ed, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-head">
              <strong>Entry {i + 1}</strong>
              <ItemControls
                canUp={i > 0}
                canDown={i < resume.education.length - 1}
                onUp={() => edit((r) => (r.education = moveItem(r.education, i, i - 1)))}
                onDown={() => edit((r) => (r.education = moveItem(r.education, i, i + 1)))}
                onDelete={() => edit((r) => r.education.splice(i, 1))}
              />
            </div>
            <Field label="Degree">
              <TextInput value={ed.degree} onChange={(v) => edit((r) => (r.education[i].degree = v))} />
            </Field>
            <Field label="Institution / board">
              <TextInput value={ed.institution} onChange={(v) => edit((r) => (r.education[i].institution = v))} />
            </Field>
            <Field label="Detail (year, grade, college)">
              <TextInput value={ed.detail} onChange={(v) => edit((r) => (r.education[i].detail = v))} />
            </Field>
          </div>
        ))}
      </Card>

      {/* COURSES */}
      <Card
        title="Courses and Certificates"
        actions={<AddButton onClick={() => edit((r) => r.courses.push(emptyCourse()))}>Add course</AddButton>}
      >
        {resume.courses.map((c, i) => (
          <div className="entry-block" key={i}>
            <div className="entry-block-head">
              <strong>Course {i + 1}</strong>
              <ItemControls
                canUp={i > 0}
                canDown={i < resume.courses.length - 1}
                onUp={() => edit((r) => (r.courses = moveItem(r.courses, i, i - 1)))}
                onDown={() => edit((r) => (r.courses = moveItem(r.courses, i, i + 1)))}
                onDelete={() => edit((r) => r.courses.splice(i, 1))}
              />
            </div>
            <div className="grid-2">
              <Field label="Title">
                <TextInput value={c.title} onChange={(v) => edit((r) => (r.courses[i].title = v))} />
              </Field>
              <Field label="Provider">
                <TextInput value={c.provider} onChange={(v) => edit((r) => (r.courses[i].provider = v))} />
              </Field>
            </div>
            <Field label="Detail">
              <TextInput value={c.detail} onChange={(v) => edit((r) => (r.courses[i].detail = v))} />
            </Field>
          </div>
        ))}
      </Card>
    </div>
  );
}
