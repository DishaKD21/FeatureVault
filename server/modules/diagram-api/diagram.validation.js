import { z } from "zod";

export const createDiagramSchema = z.object({
  json: z.any(),
  image: z.string().min(1),
  documentId: z.string().min(1).optional(),
});

export const updateDiagramSchema = createDiagramSchema.partial();
export const diagramIdSchema = z.object({
  id: z.string().min(1),  
})
