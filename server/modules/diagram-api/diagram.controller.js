import * as service from "./diagram.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendSuccess.js";
import { ApiError } from "../../utils/apiError.js";
import { EntityMessages } from "../../utils/messages.js";
import Documentation from "../documentation-api/documentation.model.js";
import { generateDiagramExplanation } from "../../services/aiService.js";
import { uploadToS3, deleteFromS3, getS3ObjectStream } from "../../services/s3Service.js";

const messages = EntityMessages("Diagram");

export const createDiagram = asyncHandler(async (req, res) => {
  // json comes as a string from FormData — parse it back to object
  let jsonData = req.body.json;
  if (typeof jsonData === "string") {
    try { jsonData = JSON.parse(jsonData); } catch (e) { jsonData = {}; }
  }

  if (req.body.documentId) {
    const ownedDocument = await Documentation.exists({
      _id: req.body.documentId,
      createdBy: req.user.id,
    });

    if (!ownedDocument) throw new ApiError(404, "Document not found");
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = await uploadToS3(req.file);
  }

  const diagram = await service.createDiagram({
    json: jsonData,
    image: imageUrl,
    documentId: req.body.documentId || null,
    createdBy: req.user.id,
  });

  return sendSuccess(res, diagram, messages.created, 201);
});
export const getAllDiagrams = asyncHandler(async (req, res) => {
  const diagrams = await service.getAllDiagrams(req.user.id);

  return sendSuccess(res, diagrams, messages.fetched);
});

export const getDiagramById = asyncHandler(async (req, res) => {
  const diagram = await service.getDiagramById(req.params.id, req.user.id);

  if (!diagram) throw new ApiError(404, messages.notFound);

  return sendSuccess(res, diagram, messages.fetched);
});

export const getDiagramByDocumentId = asyncHandler(async (req, res) => {
  const diagram = await service.getDiagramByDocumentId(req.params.documentId, req.user.id);

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
  if (jsonData !== undefined) {
    updateData.json = jsonData;
    updateData.explanation = "";
  }

  if (req.file) {
    const existingDiagram = await service.getDiagramById(req.params.id, req.user.id);
    if (!existingDiagram) throw new ApiError(404, messages.notFound);

    const newImageUrl = await uploadToS3(req.file);
    updateData.image = newImageUrl;

    if (existingDiagram.image) {
      try {
        await deleteFromS3(existingDiagram.image);
      } catch (err) {
        console.error("Failed to delete old image from S3:", err);
      }
    }
  }

  const updated = await service.updateDiagram(req.params.id, req.user.id, updateData);
  if (!updated) throw new ApiError(404, messages.notFound);

  return sendSuccess(res, updated, messages.updated);
});

export const deleteDiagram = asyncHandler(async (req, res) => {
  const diagram = await service.getDiagramById(req.params.id, req.user.id);
  if (!diagram) throw new ApiError(404, messages.notFound);

  if (diagram.image) {
    try {
      await deleteFromS3(diagram.image);
    } catch (err) {
      console.error("Failed to delete diagram image from S3:", err);
    }
  }

  const deleted = await service.deleteDiagram(req.params.id, req.user.id);
  if (!deleted) throw new ApiError(404, messages.notFound);

  return sendSuccess(res, null, messages.deleted);
});

export const generateExplanation = asyncHandler(async (req, res) => {
  const { documentId, diagramId } = req.body;

  const ownedDocument = await Documentation.exists({
    _id: documentId,
    createdBy: req.user.id,
  });

  if (!ownedDocument) throw new ApiError(404, "Document not found");

  const diagram = await service.getDiagramById(diagramId, req.user.id);
  if (!diagram) throw new ApiError(404, "Diagram not found");

  if (!diagram.documentId || diagram.documentId.toString() !== documentId) {
    throw new ApiError(400, "Diagram is not linked to the provided document");
  }

  const aiResponse = await generateDiagramExplanation({ documentId, diagramId });

  if (aiResponse?.explanation) {
    await service.updateDiagram(diagramId, req.user.id, {
      explanation: aiResponse.explanation,
    });
  }

  const refreshed = await service.getDiagramById(diagramId, req.user.id);

  return sendSuccess(
    res,
    { explanation: refreshed?.explanation || aiResponse?.explanation || "" },
    "Explanation generated"
  );
});

export const downloadDiagram = asyncHandler(async (req, res) => {
  const diagram = await service.getDiagramById(req.params.id, req.user.id);
  if (!diagram || !diagram.image) {
    throw new ApiError(404, "Diagram or image not found");
  }

  const filename = `${req.query.filename || "diagram"}.png`;

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "image/png");

  const bucketName = process.env.AWS_BUCKET_NAME;
  const urlPrefix = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`;

  if (diagram.image.startsWith(urlPrefix)) {
    try {
      const stream = await getS3ObjectStream(diagram.image);
      stream.pipe(res);
    } catch (err) {
      console.error("Failed to stream diagram from S3:", err);
      throw new ApiError(500, "Failed to download image from S3");
    }
  } else {
    // Stream local file for legacy backward compatibility
    res.download(diagram.image, filename);
  }
});

