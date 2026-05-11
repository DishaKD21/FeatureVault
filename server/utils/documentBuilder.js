import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { Document } from "docx";
import {
  createBodyParagraph,
  createBulletParagraph,
  createCenteredImageParagraph,
  createDocTitle,
  createLabeledParagraph,
  createMutedParagraph,
  createSectionHeading,
  createStyledTable,
  createSubsectionHeading,
  defaultSectionProps,
} from "./documentDocxStyles.js";

function getAllKeys(arr = []) {
  const keys = new Set();
  arr.forEach((obj) => Object.keys(obj || {}).forEach((k) => keys.add(k)));
  return Array.from(keys);
}

function formatDocDate(value) {
  if (value === undefined || value === null || value === "") return "—";
  try {
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return String(value);
  }
}

async function getImageBuffer(imagePath) {
  if (imagePath.startsWith("http")) {
    const res = await fetch(imagePath);
    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer);
  }

  const absolutePath = path.resolve(process.cwd(), imagePath);
  return fs.promises.readFile(absolutePath);
}

export async function buildDocument(data) {
  const children = [];

  children.push(createDocTitle(data.feature?.featureName || "Untitled Document"));

  /* ─── Requirement elicitation ─── */
  children.push(createSectionHeading("Requirement elicitation"));
  children.push(createLabeledParagraph("Start", formatDocDate(data.requirementElicitation?.startTime)));
  children.push(createLabeledParagraph("End", formatDocDate(data.requirementElicitation?.endTime)));
  children.push(createBodyParagraph(data.requirementElicitation?.discussion || ""));

  /* ─── Feature description ─── */
  children.push(createSectionHeading("Feature description"));
  children.push(createLabeledParagraph("Start", formatDocDate(data.feature?.featureDescription?.startTime)));
  children.push(createLabeledParagraph("End", formatDocDate(data.feature?.featureDescription?.endTime)));
  children.push(createBodyParagraph(data.feature?.featureDescription?.requirementAnalysis || ""));

  /* ─── Design diagram ─── */
  if (data.designDiagram?.imageLink) {
    children.push(createSectionHeading("Design diagram"));

    try {
      const imgBuffer = await getImageBuffer(data.designDiagram.imageLink);
      children.push(createCenteredImageParagraph(imgBuffer, 520, 320));
    } catch {
      children.push(createMutedParagraph(`[Image could not be loaded: ${data.designDiagram.imageLink}]`));
    }
  }

  if (data.designDiagram?.explanation) {
    children.push(createSectionHeading("Diagram explanation"));
    children.push(createBodyParagraph(data.designDiagram.explanation));
  }

  /* ─── User story distribution ─── */
  children.push(createSectionHeading("User story distribution"));
  if (data.featureEstimate?.userStoryDistribution?.length) {
    const headers = getAllKeys(data.featureEstimate.userStoryDistribution);
    const table = createStyledTable(headers, data.featureEstimate.userStoryDistribution);
    if (table) children.push(table);
  } else {
    children.push(createMutedParagraph("No user story rows were added for this section."));
  }

  /* ─── Tracking & release ─── */
  children.push(createSectionHeading("Tracking & release details"));

  data.trackingAndReleaseDetails?.forEach((item, index) => {
    children.push(createSubsectionHeading(`User story ${index + 1}`));
    children.push(createLabeledParagraph("User story ID / number", item.userStoryNumber));
    children.push(createLabeledParagraph("Issue / story link", item.userStoryLink));
    children.push(createLabeledParagraph("Code description", item.codeDescription));

    if (item.prLinks?.length) {
      children.push(createBodyParagraph("Pull requests:"));
      item.prLinks.forEach((l) => children.push(createBulletParagraph(l)));
    }
    if (item.pipelineBuildLinks?.length) {
      children.push(createBodyParagraph("Pipeline / build links:"));
      item.pipelineBuildLinks.forEach((l) => children.push(createBulletParagraph(l)));
    }
    if (item.environmentDeployLinks?.length) {
      children.push(createBodyParagraph("Environment / deploy links:"));
      item.environmentDeployLinks.forEach((l) => children.push(createBulletParagraph(l)));
    }
  });

  /* ─── Retrospective ─── */
  children.push(createSectionHeading("Retrospective"));
  if (data.retrospectiveSection?.length) {
    const headers = getAllKeys(data.retrospectiveSection);
    const table = createStyledTable(headers, data.retrospectiveSection);
    if (table) children.push(table);
  } else {
    children.push(createMutedParagraph("No retrospective table rows were added."));
  }

  /* ─── Created by ─── */
  children.push(createSectionHeading("Created by"));
  children.push(createLabeledParagraph("Name", data.whoCreatedIt?.name));
  children.push(createLabeledParagraph("Employee ID", data.whoCreatedIt?.empId));
  children.push(createLabeledParagraph("Total time", `${data.whoCreatedIt?.totalTime ?? "—"} hours`));

  return new Document({
    sections: [
      {
        properties: defaultSectionProps,
        children,
      },
    ],
  });
}
