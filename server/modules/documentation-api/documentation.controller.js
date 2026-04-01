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

export const createDocument = asyncHandler(async (req, res) => {
  const doc = await documentService.createDocument(req.body);
 
  return sendSuccess(res, doc, messages.created, 201);
});

export const updateDocument = asyncHandler(async (req, res) => {
  const updated = await documentService.updateDocument(
    req.params.id,
    req.body
  );
  return sendSuccess(res, updated, messages.updated);
});

export const deleteDocument = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(req.params.id);
  return sendSuccess(res, null, messages.deleted);
});