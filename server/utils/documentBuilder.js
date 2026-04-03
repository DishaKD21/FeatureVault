import {
  Document,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TextRun,
  ImageRun
} from "docx";

import fetch from "node-fetch";

function createHeading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 28 })],
    heading: HeadingLevel.HEADING_1,
  });
}

function createParagraph(text) {
  return new Paragraph({
    children: [new TextRun({ text: String(text || ""), size: 24 })],
  });
}

function getAllKeys(arr = []) {
  const keys = new Set();
  arr.forEach(obj => Object.keys(obj).forEach(k => keys.add(k)));
  return Array.from(keys);
}

function createDynamicTable(headers = [], data = []) {
  if (!headers.length || !data.length) return null;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: headers.map(
          (header) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: header, bold: true })],
                }),
              ],
            })
        ),
      }),
      ...data.map((row) =>
        new TableRow({
          children: headers.map(
            (key) =>
              new TableCell({
                children: [createParagraph(row[key])],
              })
          ),
        })
      ),
    ],
  });
}

async function getImageBuffer(url) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer);
}

export async function buildDocument(data) {
  const children = [];

  children.push(
    new Paragraph({
      text: data.featureName,
      heading: HeadingLevel.TITLE,
    })
  );

  children.push(createHeading("Requirement Elicitation"));
  children.push(createParagraph(`Start: ${data.requirementElicitation?.startTime}`));
  children.push(createParagraph(data.requirementElicitation?.discussion));
  children.push(createParagraph(`End: ${data.requirementElicitation?.endTime}`));

  children.push(createHeading("Feature Description"));
  children.push(createParagraph(`Start: ${data.featureDescription?.startTime}`));
  children.push(createParagraph(data.featureDescription?.requirementAnalysis));
  children.push(createParagraph(`End: ${data.featureDescription?.endTime}`));

  if (data.designDiagram?.imageLink) {
    children.push(createHeading("Design Diagram"));

    const imgBuffer = await getImageBuffer(data.designDiagram.imageLink);

    children.push(
      new Paragraph({
        children: [
          new ImageRun({
            data: imgBuffer,
            transformation: { width: 500, height: 300 },
          }),
        ],
      })
    );
  }

  children.push(createHeading("Feature Estimate"));
  children.push(createParagraph(`Total Days: ${data.featureEstimate?.totalDays}`));
  children.push(createParagraph(`Complexity: ${data.featureEstimate?.complexity}`));

  children.push(createParagraph("Breakdown:"));
  Object.entries(data.featureEstimate?.breakdown || {}).forEach(([k, v]) => {
    children.push(createParagraph(`${k}: ${v}`));
  });

  children.push(createHeading("User Story Distribution"));

  if (data.userStoryDistribution?.length) {
    const headers = getAllKeys(data.userStoryDistribution);
    const table = createDynamicTable(headers, data.userStoryDistribution);
    if (table) children.push(table);
  }

  children.push(createHeading("Tracking & Release Details"));

  data.trackingAndReleaseDetails?.forEach((item) => {
    children.push(createParagraph(`User Story: ${item.userStoryNumber}`));
    children.push(createParagraph(`JIRA: ${item.userStoryLink}`));
    children.push(createParagraph(`Description: ${item.codeDescription}`));

    item.prLinks?.forEach((l) =>
      children.push(createParagraph(`PR: ${l}`))
    );

    item.pipelineBuildLinks?.forEach((l) =>
      children.push(createParagraph(`Build: ${l}`))
    );

    item.environmentDeployLinks?.forEach((l) =>
      children.push(createParagraph(`Deploy: ${l}`))
    );
  });

  children.push(createHeading("Retrospective"));

  if (data.retrospectiveSection?.length) {
    const headers = getAllKeys(data.retrospectiveSection);
    const table = createDynamicTable(headers, data.retrospectiveSection);
    if (table) children.push(table);
  }

  children.push(createHeading("Created By"));
  children.push(createParagraph(`Name: ${data.whoCreatedIt?.name}`));
  children.push(createParagraph(`Emp ID: ${data.whoCreatedIt?.empId}`));
  children.push(createParagraph(`Time: ${data.whoCreatedIt?.totalTime} hrs`));

  return new Document({
    sections: [{ children }],
  });
}