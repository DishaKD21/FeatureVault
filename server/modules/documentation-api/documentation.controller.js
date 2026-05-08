import * as documentService from "./documentation.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendSuccess.js";
import { ApiError } from "../../utils/apiError.js";
import { EntityMessages } from "../../utils/messages.js";
import Diagram from "../diagram-api/diagram.model.js";

const messages = EntityMessages("Document");

export const getAllDocuments = asyncHandler(async (req, res) => {
  const docs = await documentService.getAllDocuments(req.user.id);
  return sendSuccess(res, docs, messages.fetched);
});

export const getDocumentById = asyncHandler(async (req, res) => {
  const doc = await documentService.getDocumentById(req.params.id, req.user.id);
  if (!doc) {
    throw new ApiError(404, messages.notFound);
  }

  const payload = doc.toObject();

  if (payload.designDiagram?.diagramId) {
    const diagram = await Diagram.findOne({
      _id: payload.designDiagram.diagramId,
      createdBy: req.user.id,
    }).lean();

    if (diagram?.explanation) {
      payload.designDiagram.explanation = diagram.explanation;
    }
  }

  return sendSuccess(res, payload, messages.fetched);
});

export const createDraft = asyncHandler(async (req, res) => {
  const draft = await documentService.createDraft(req.user.id);
  return sendSuccess(res, draft, "Draft created successfully", 201);
});

export const updateDraft = asyncHandler(async (req, res) => {
  const updated = await documentService.updateDraft(req.params.id, req.user.id, req.body);
  if (!updated) {
    throw new ApiError(404, messages.notFound);
  }
  return sendSuccess(res, updated, "Draft updated successfully");
});

export const submitDocument = asyncHandler(async (req, res) => {
  const submitted = await documentService.submitDocument(req.params.id, req.user.id, req.body);
  if (!submitted) {
    throw new ApiError(404, messages.notFound);
  }
  return sendSuccess(res, submitted, "Document submitted successfully");
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const deleted = await documentService.deleteDocument(req.params.id, req.user.id);
  if (!deleted) {
    throw new ApiError(404, messages.notFound);
  }
  return sendSuccess(res, null, messages.deleted);
});
