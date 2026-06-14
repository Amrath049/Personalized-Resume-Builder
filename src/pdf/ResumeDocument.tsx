// The resume as a react-pdf Document. The on-screen preview and the downloaded
// file both render from this single component (true WYSIWYG).

import { Document, Page, Text, View, Link } from '@react-pdf/renderer';
import type { Resume, Settings } from '../types';
import { makeStyles } from './theme';
import { registerFonts } from './fonts';
import { LocationIcon, MailIcon, PhoneIcon, LinkedInIcon, GithubIcon } from './icons';

registerFonts();

interface Props {
  resume: Resume;
  settings: Settings;
}

function httpUrl(s: string): string {
  if (!s) return '';
  return s.startsWith('http') ? s : `https://${s}`;
}

function Bullet({ text, styles }: { text: string; styles: ReturnType<typeof makeStyles> }) {
  if (!text.trim()) return null;
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function SectionTitle({ children, styles }: { children: string; styles: ReturnType<typeof makeStyles> }) {
  return <Text style={styles.sectionTitle}>{children.toUpperCase()}</Text>;
}

export function ResumeDocument({ resume, settings }: Props) {
  const styles = makeStyles(settings);
  const { header } = resume;
  const iconSize = 9 * (settings.fontScale || 1);

  return (
    <Document title={header.name} author={header.name}>
      <Page size={settings.pageSize} style={styles.page}>
        {/* Header */}
        <Text style={styles.name}>{header.name}</Text>
        {!!header.title && <Text style={styles.title}>{header.title}</Text>}

        {(header.linkedin || header.github) && (
          <View style={styles.contactRow}>
            {!!header.linkedin && (
              <View style={styles.contactItem}>
                <LinkedInIcon size={iconSize} />
                <Link src={httpUrl(header.linkedin)} style={styles.contactLink}>
                  {header.linkedin}
                </Link>
              </View>
            )}
            {!!header.github && (
              <View style={styles.contactItem}>
                <GithubIcon size={iconSize} />
                <Link src={httpUrl(header.github)} style={styles.contactLink}>
                  {header.github}
                </Link>
              </View>
            )}
          </View>
        )}

        <View style={styles.contactRow}>
          {!!header.location && (
            <View style={styles.contactItem}>
              <LocationIcon size={iconSize} />
              <Text style={styles.contactText}>{header.location}</Text>
            </View>
          )}
          {!!header.email && (
            <View style={styles.contactItem}>
              <MailIcon size={iconSize} />
              <Link src={`mailto:${header.email}`} style={styles.contactLink}>
                {header.email}
              </Link>
            </View>
          )}
          {!!header.phone && (
            <View style={styles.contactItem}>
              <PhoneIcon size={iconSize} />
              <Text style={styles.contactText}>{header.phone}</Text>
            </View>
          )}
        </View>

        {/* Professional Summary */}
        {!!resume.summary.trim() && (
          <View style={styles.section}>
            <SectionTitle styles={styles}>Professional Summary</SectionTitle>
            <Text style={styles.summary}>{resume.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <View style={styles.section}>
            <SectionTitle styles={styles}>Experience</SectionTitle>
            {resume.experience.map((e, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <Text style={styles.entryRole}>{e.role}</Text>
                <View style={styles.entryHeadRow}>
                  <Text style={styles.entryCompany}>{e.company}</Text>
                  <Text style={styles.entryDate}>{e.dateRange}</Text>
                </View>
                {e.bullets.map((b, j) => (
                  <Bullet key={j} text={b} styles={styles} />
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resume.projects.length > 0 && (
          <View style={styles.section}>
            <SectionTitle styles={styles}>Projects</SectionTitle>
            {resume.projects.map((p, i) => (
              <View key={i} style={styles.entry}>
                <Text style={styles.entryRole}>{p.name}</Text>
                {!!p.techStack && (
                  <Text style={styles.entrySub}>
                    <Text style={{ fontWeight: 'bold' }}>Tech Stack: </Text>
                    {p.techStack}
                  </Text>
                )}
                {p.bullets.map((b, j) => (
                  <Bullet key={j} text={b} styles={styles} />
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <View style={styles.section}>
            <SectionTitle styles={styles}>Skills</SectionTitle>
            {resume.skills.map((s, i) =>
              s.label || s.value ? (
                <Text key={i} style={styles.skillRow}>
                  <Text style={styles.skillLabel}>{s.label}: </Text>
                  <Text>{s.value}</Text>
                </Text>
              ) : null,
            )}
          </View>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <View style={styles.section}>
            <SectionTitle styles={styles}>Education</SectionTitle>
            {resume.education.map((ed, i) => (
              <View key={i} style={styles.entry}>
                <Text style={styles.eduDegree}>{ed.degree}</Text>
                {!!ed.institution && <Text>{ed.institution}</Text>}
                {!!ed.detail && <Text style={styles.entryDate}>{ed.detail}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Courses & Certificates */}
        {resume.courses.length > 0 && (
          <View style={styles.section}>
            <SectionTitle styles={styles}>Courses and Certificates</SectionTitle>
            {resume.courses.map((c, i) => (
              <View key={i} style={styles.entry}>
                <Text>
                  <Text style={styles.courseTitle}>{c.title}</Text>
                  {!!c.provider && <Text style={styles.entryDate}>{`  ${c.provider}`}</Text>}
                </Text>
                {!!c.detail && <Text style={styles.entryDate}>{c.detail}</Text>}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
