import * as service from "./diagram.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendSuccess.js";
import { ApiError } from "../../utils/apiError.js";
import { EntityMessages } from "../../utils/messages.js";

const messages = EntityMessages("Diagram");

export const createDiagram = asyncHandler(async (req, res) => {
  // json comes as a string from FormData — parse it back to object
  let jsonData = req.body.json;
  if (typeof jsonData === "string") {
    try { jsonData = JSON.parse(jsonData); } catch (e) { jsonData = {}; }
  }

  const diagram = await service.createDiagram({
    json: jsonData,
    image: req.file?.path || null,
    documentId: req.body.documentId || null           
  });

  return sendSuccess(res, diagram, messages.created, 201);
});
export const getAllDiagrams = asyncHandler(async (req, res) => {
  const diagrams = await service.getAllDiagrams();

  return sendSuccess(res, diagrams, messages.fetched);
});

export const getDiagramById = asyncHandler(async (req, res) => {
  const diagram = await service.getDiagramById(req.params.id);

  if (!diagram) throw new ApiError(404, messages.notFound);

  return sendSuccess(res, diagram, messages.fetched);
});

export const getDiagramByDocumentId = asyncHandler(async (req, res) => {
  const diagram = await service.getDiagramByDocumentId(req.params.documentId);

  // Return success even if null, so frontend can handle it without 404 errors in logs
  return sendSuccess(res, diagram, diagram ? messages.fetched : "No diagram found for this document");
});

export const updateDiagram = asyncHandler(async (req, res) => {
  // json comes as a string from FormData — parse it back to object
  let jsonData = req.body.json;
  if (typeof jsonData === "string") {
    try { jsonData = JSON.parse(jsonData); } catch (e) { jsonData = undefined; }
  }

  const updateData = {};
  if (jsonData !== undefined) updateData.json = jsonData;
  if (req.file?.path) updateData.image = req.file.path;

  const updated = await service.updateDiagram(req.params.id, updateData);

  return sendSuccess(res, updated, messages.updated);
});

export const deleteDiagram = asyncHandler(async (req, res) => {
  await service.deleteDiagram(req.params.id);

  return sendSuccess(res, null, messages.deleted);
});