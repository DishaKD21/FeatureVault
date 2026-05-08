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

import fs from "fs";
import path from "path";

async function getImageBuffer(imagePath) {
  // If it's a full URL, we could fetch it, but diagram.image is stored as relative path like "upload/filename"
  if (imagePath.startsWith("http")) {
    const res = await fetch(imagePath);
    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer);
  }
  
  // Read from local file system
  const absolutePath = path.resolve(process.cwd(), imagePath);
  return await fs.promises.readFile(absolutePath);
}

export async function buildDocument(data) {
  const children = [];

  children.push(
    new Paragraph({
      text: data.feature?.featureName || "Untitled Document",
      heading: HeadingLevel.TITLE,
    })
  );

  children.push(createHeading("Requirement Elicitation"));
  children.push(createParagraph(`Start: ${data.requirementElicitation?.startTime}`));
  children.push(createParagraph(data.requirementElicitation?.discussion));
  children.push(createParagraph(`End: ${data.requirementElicitation?.endTime}`));

  children.push(createHeading("Feature Description"));
  children.push(createParagraph(`Start: ${data.feature?.featureDescription?.startTime}`));
  children.push(createParagraph(data.feature?.featureDescription?.requirementAnalysis));
  children.push(createParagraph(`End: ${data.feature?.featureDescription?.endTime}`));

  if (data.designDiagram?.imageLink) {
    children.push(createHeading("Design Diagram"));

    try {
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
    } catch (err) {
      children.push(createParagraph(`[Image could not be loaded: ${data.designDiagram.imageLink}]`));
    }
  }

  if (data.designDiagram?.explanation) {
    children.push(createHeading("Diagram Explanation"));
    children.push(createParagraph(data.designDiagram.explanation));
  }

  children.push(createHeading("User Story Distribution"));

  if (data.featureEstimate?.userStoryDistribution?.length) {
    const headers = getAllKeys(data.featureEstimate.userStoryDistribution);
    const table = createDynamicTable(headers, data.featureEstimate.userStoryDistribution);
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