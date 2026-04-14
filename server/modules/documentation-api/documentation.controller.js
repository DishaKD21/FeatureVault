import * as documentService from "./documentation.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendSuccess.js";
import { ApiError } from "../../utils/apiError.js";
import { EntityMessages } from "../../utils/messages.js";

const messages = EntityMessages("Document");

export const getAllDocuments = asyncHandler(async (req, res) => {
  const docs = await documentService.getAllDocuments();
  return sendSuccess(res, docs, messages.fetched);
});

export const getDocumentById = asyncHandler(async (req, res) => {
  const doc = await documentService.getDocumentById(req.params.id);
  if (!doc) {
    throw new ApiError(404, messages.notFound);
  }
  return sendSuccess(res, doc, messages.fetched);
});

export const createDraft = asyncHandler(async (req, res) => {
  const draft = await documentService.createDraft();
  return sendSuccess(res, draft, "Draft created successfully", 201);
});

export const updateDraft = asyncHandler(async (req, res) => {
  const updated = await documentService.updateDraft(req.params.id, req.body);
  if (!updated) {
    throw new ApiError(404, messages.notFound);
  }
  return sendSuccess(res, updated, "Draft updated successfully");
});

export const submitDocument = asyncHandler(async (req, res) => {
  const submitted = await documentService.submitDocument(req.params.id, req.body);
  if (!submitted) {
    throw new ApiError(404, messages.notFound);
  }
  return sendSuccess(res, submitted, "Document submitted successfully");
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(req.params.id);
  return sendSuccess(res, null, messages.deleted);
});