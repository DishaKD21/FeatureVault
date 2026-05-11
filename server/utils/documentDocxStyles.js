/**
 * Centralized typography, spacing, and table styles for Word (.docx) export.
 * Colors: dark blue headings, charcoal body, light gray header fills — Word-safe hex (no #).
 */
import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  HeadingLevel,
  ImageRun,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

export const DOCX_THEME = {
  FONT_PRIMARY: "Calibri",
  FONT_HEADING: "Calibri",

  /** Half-points (docx TextRun `size`) */
  PT_TITLE: 56, // 28 pt
  PT_H1: 36, // 18 pt
  PT_H2: 28, // 14 pt
  PT_BODY: 24, // 12 pt
  PT_SMALL: 22, // 11 pt
  PT_TABLE: 22,

  COLOR_TEXT: "2D3436",
  COLOR_TEXT_MUTED: "5F6368",
  COLOR_HEADING: "1B365D",
  COLOR_HEADING_ON_FILL: "1B365D",
  COLOR_LABEL: "37474F",

  HEADER_ROW_FILL: "D6E4F0",
  BORDER_TABLE: "A8B8CC",
  BORDER_SOFT: "D0D7DE",

  /** Spacing after paragraphs (twips, 1/20 pt) */
  SPACE_AFTER_BODY: 200,
  SPACE_AFTER_TIGHT: 120,
  SPACE_BEFORE_SECTION: 360,
  SPACE_AFTER_HEADING: 160,

  /** Line spacing (twips); ~1.2× at 11pt */
  LINE_SPACING: 288,
};

function bodySpacing(overrides = {}) {
  return {
    after: DOCX_THEME.SPACE_AFTER_BODY,
    line: DOCX_THEME.LINE_SPACING,
    lineRule: "auto",
    ...overrides,
  };
}

/** Document title (cover line). */
export function createDocTitle(text) {
  return new Paragraph({
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 280, line: 360, lineRule: "auto" },
    children: [
      new TextRun({
        text: String(text || "Untitled Document"),
        bold: true,
        size: DOCX_THEME.PT_TITLE,
        font: DOCX_THEME.FONT_HEADING,
        color: DOCX_THEME.COLOR_HEADING,
      }),
    ],
  });
}

/** Major section heading (H1). */
export function createSectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: {
      before: DOCX_THEME.SPACE_BEFORE_SECTION,
      after: DOCX_THEME.SPACE_AFTER_HEADING,
      line: 320,
      lineRule: "auto",
    },
    border: {
      bottom: { color: DOCX_THEME.BORDER_SOFT, space: 1, style: BorderStyle.SINGLE, size: 6 },
    },
    children: [
      new TextRun({
        text: String(text || ""),
        bold: true,
        size: DOCX_THEME.PT_H1,
        font: DOCX_THEME.FONT_HEADING,
        color: DOCX_THEME.COLOR_HEADING,
      }),
    ],
  });
}

/** Subsection (e.g. per user story block). */
export function createSubsectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: DOCX_THEME.SPACE_AFTER_TIGHT, line: 300, lineRule: "auto" },
    children: [
      new TextRun({
        text: String(text || ""),
        bold: true,
        size: DOCX_THEME.PT_H2,
        font: DOCX_THEME.FONT_HEADING,
        color: DOCX_THEME.COLOR_HEADING,
      }),
    ],
  });
}

export function createBodyParagraph(text, options = {}) {
  const { spacing: spacingOverride, alignment } = options;
  return new Paragraph({
    alignment: alignment ?? AlignmentType.LEFT,
    spacing: bodySpacing(spacingOverride),
    children: [
      new TextRun({
        text: String(text ?? ""),
        size: DOCX_THEME.PT_BODY,
        font: DOCX_THEME.FONT_PRIMARY,
        color: DOCX_THEME.COLOR_TEXT,
      }),
    ],
  });
}

/** Indented bullet line (no Word numbering XML — maximum compatibility). */
export function createBulletParagraph(text) {
  return new Paragraph({
    spacing: bodySpacing({ after: DOCX_THEME.SPACE_AFTER_TIGHT }),
    indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.18) },
    children: [
      new TextRun({
        text: `\u2022\t${String(text ?? "")}`,
        size: DOCX_THEME.PT_BODY,
        font: DOCX_THEME.FONT_PRIMARY,
        color: DOCX_THEME.COLOR_TEXT,
      }),
    ],
  });
}

/** Label in bold + value (e.g. Start: Jan 1, 2025). */
export function createLabeledParagraph(label, value) {
  const v = value === undefined || value === null || value === "" ? "—" : String(value);
  return new Paragraph({
    spacing: bodySpacing({ after: DOCX_THEME.SPACE_AFTER_TIGHT }),
    children: [
      new TextRun({
        text: `${String(label)}: `,
        bold: true,
        size: DOCX_THEME.PT_BODY,
        font: DOCX_THEME.FONT_PRIMARY,
        color: DOCX_THEME.COLOR_LABEL,
      }),
      new TextRun({
        text: v,
        size: DOCX_THEME.PT_BODY,
        font: DOCX_THEME.FONT_PRIMARY,
        color: DOCX_THEME.COLOR_TEXT,
      }),
    ],
  });
}

export function createMutedParagraph(text) {
  return new Paragraph({
    spacing: bodySpacing({ after: DOCX_THEME.SPACE_AFTER_TIGHT }),
    children: [
      new TextRun({
        text: String(text ?? ""),
        size: DOCX_THEME.PT_SMALL,
        italics: true,
        font: DOCX_THEME.FONT_PRIMARY,
        color: DOCX_THEME.COLOR_TEXT_MUTED,
      }),
    ],
  });
}

const tableBorder = (size = 4) => ({
  style: BorderStyle.SINGLE,
  size,
  color: DOCX_THEME.BORDER_TABLE,
});

function tableBorders() {
  const b = tableBorder();
  return {
    top: b,
    bottom: b,
    left: b,
    right: b,
    insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: DOCX_THEME.BORDER_SOFT },
    insideVertical: { style: BorderStyle.SINGLE, size: 2, color: DOCX_THEME.BORDER_SOFT },
  };
}

function cellParagraph(text, { bold = false, header = false } = {}) {
  return new Paragraph({
    spacing: { after: 80, before: 0, line: 260, lineRule: "auto" },
    children: [
      new TextRun({
        text: String(text ?? ""),
        bold: header || bold,
        size: header ? DOCX_THEME.PT_TABLE + 1 : DOCX_THEME.PT_TABLE,
        font: DOCX_THEME.FONT_PRIMARY,
        color: header ? DOCX_THEME.COLOR_HEADING_ON_FILL : DOCX_THEME.COLOR_TEXT,
      }),
    ],
  });
}

/**
 * Professional table with padded cells, borders, and shaded header row.
 */
export function createStyledTable(headers = [], data = []) {
  if (!headers.length || !data.length) return null;

  const colCount = headers.length;
  const totalTwip = 9000;
  const colWidth = Math.floor(totalTwip / colCount);

  const headerCells = headers.map(
    (header) =>
      new TableCell({
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        shading: {
          type: ShadingType.CLEAR,
          fill: DOCX_THEME.HEADER_ROW_FILL,
          color: "auto",
        },
        children: [cellParagraph(header, { header: true })],
      }),
  );

  const bodyRows = data.map(
    (row) =>
      new TableRow({
        children: headers.map(
          (key) =>
            new TableCell({
              margins: { top: 100, bottom: 100, left: 160, right: 160 },
              children: [cellParagraph(row[key], { bold: false })],
            }),
        ),
      }),
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: Array(colCount).fill(colWidth),
    borders: tableBorders(),
    rows: [new TableRow({ children: headerCells }), ...bodyRows],
  });
}

/** Page margins (twips): ~1" sides, balanced top/bottom. */
export const defaultSectionProps = {
  page: {
    margin: {
      top: convertInchesToTwip(1),
      right: convertInchesToTwip(1),
      bottom: convertInchesToTwip(1),
      left: convertInchesToTwip(1),
    },
  },
};

/** Centered diagram image with comfortable vertical spacing. */
export function createCenteredImageParagraph(imgBuffer, width = 520, height = 320) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 280, line: 276, lineRule: "auto" },
    children: [
      new ImageRun({
        data: imgBuffer,
        transformation: { width, height },
      }),
    ],
  });
}
