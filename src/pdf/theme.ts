// Visual theme for the PDF — sizes/colors tuned to match the existing resume.
// Everything scales by settings.fontScale so you can nudge content to fit one page.

import { StyleSheet } from "@react-pdf/renderer";
import type { Settings } from "../types";

export const COLORS = {
  text: "#1a1a1a",
  heading: "#000000",
  muted: "#3a3a3a",
  rule: "#000000",
  link: "#1a1a1a",
};

export const FONT_FAMILY = "Carlito";

export function makeStyles(settings: Settings) {
  const s = settings.fontScale || 1;
  const px = (n: number) => n * s;

  return StyleSheet.create({
    page: {
      fontFamily: FONT_FAMILY,
      fontSize: px(9.3),
      color: COLORS.text,
      lineHeight: 1.3,
      paddingTop: 26,
      paddingBottom: 22,
      paddingHorizontal: 34,
    },

    // Header
    name: {
      fontSize: px(18),
      fontWeight: "bold",
      textAlign: "center",
      letterSpacing: 0.5,
      color: COLORS.heading,
      marginBottom: 10,
    },
    title: {
      fontSize: px(9.5),
      textAlign: "center",
      marginTop: 0,
      color: COLORS.muted,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 3,
    },
    contactItem: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 5,
    },
    contactText: {
      fontSize: px(8.5),
      color: COLORS.text,
      marginLeft: 2.5,
    },
    contactLink: {
      fontSize: px(8.5),
      color: COLORS.link,
      marginLeft: 2.5,
      textDecoration: "none",
    },

    // Sections
    section: { marginTop: px(7) },
    sectionTitle: {
      fontSize: px(10.5),
      fontWeight: "bold",
      letterSpacing: 0.5,
      color: COLORS.heading,
      borderBottomWidth: 0.8,
      borderBottomColor: COLORS.rule,
      paddingBottom: 1.5,
      marginBottom: 3,
    },

    summary: { textAlign: "justify" },

    // Entry blocks (experience / projects / education / courses)
    entry: { marginBottom: px(4) },
    entryHeadRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    entryRole: { fontWeight: "bold", color: COLORS.heading },
    entryCompany: { color: COLORS.text },
    entryDate: { color: COLORS.muted, fontSize: px(8.8) },
    entrySub: { color: COLORS.muted, marginBottom: 1 }, // tech stack line

    // Bullets
    bulletRow: { flexDirection: "row", marginTop: 1 },
    bulletDot: { width: px(9), color: COLORS.text },
    bulletText: { flex: 1, textAlign: "justify" },

    // Skills
    skillRow: { marginBottom: 1, flexDirection: "row" },
    skillLabel: { fontWeight: "bold", color: COLORS.heading },
    skillValue: { flex: 1 },

    // Education / courses
    eduDegree: { fontWeight: "bold", color: COLORS.heading },
    courseTitle: { fontWeight: "bold", color: COLORS.heading },
  });
}

export type Styles = ReturnType<typeof makeStyles>;
