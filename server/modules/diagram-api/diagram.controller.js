import * as service from "./diagram.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendSuccess.js";
import { ApiError } from "../../utils/apiError.js";
import { EntityMessages } from "../../utils/messages.js";

const messages = EntityMessages("Diagram");

export const createDiagram = asyncHandler(async (req, res) => {
  const diagram = await service.createDiagram({
    ...req.body,
    image: req.file?.path,          
  });

  return sendSuccess(res, diagram, messages.created, 201);
});
export const getAllDiagrams = asyncHandler(async (req, res) => {
  const diagrams = await service.getAllDiagrams();

  return sendSuccess(res, diagrams, messages.fetched);
});

export const getDiagramById = asyncHandler(async (req, res) => {
  const diagram = await service.getDiagramById(req.params.id);

  if (!diagram) throw new ApiError(404, messages.notfound);

  return sendSuccess(res, diagram, messages.fetched);
});

export const updateDiagram = asyncHandler(async (req, res) => {
  const updated = await service.updateDiagram(req.params.id, req.body);

  return sendSuccess(res, updated, messages.updated);
});

export const deleteDiagram = asyncHandler(async (req, res) => {
  await service.deleteDiagram(req.params.id);

  return sendSuccess(res, null, messages.deleted);
});