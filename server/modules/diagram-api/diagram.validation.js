import { z } from "zod";

export const createDiagramSchema = z.object({
  json: z.any(),
  image: z.string().min(1),
  documentId: z.string().min(1).optional(),
});

export const updateDiagramSchema = z.createDiagramSchema.partial();
export const diagramIdSchema = z.object({
  ifd: z.string().min(1),  
})
