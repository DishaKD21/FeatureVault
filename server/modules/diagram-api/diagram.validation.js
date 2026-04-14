import { z } from "zod";

export const createDiagramSchema = z.object({
  json: z.any(),
  documentId: z.string().optional().nullable(),
});

export const updateDiagramSchema = z.object({
  json: z.any().optional(),
}).partial();

export const diagramIdSchema = z.object({
  id: z.string().min(1),  
});

// Separate schema for by-document route (param is :documentId, not :id)
export const documentIdSchema = z.object({
  documentId: z.string().min(1),
});
