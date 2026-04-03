import * as z from "zod";
export const createDocumentSchema = z.object({
  requirementElicitation: z.object({
    startTime: z.string(),
    discussion: z.string(),
    endTime: z.string(),
  }),

  feature: z.object({
    featureName: z.string(),
    featureDescription: z.object({
      startTime: z.string(),
      requirementAnalysis: z.string(),
      endTime: z.string(),
    }),
  }),

  designDiagram: z.object({
    diagramId: z.string().min(1),
  }),

  featureEstimate: z.object({
    userStoryDistribution: z.array(z.any()),
  }),

  trackingAndReleaseDetails: z.array(
    z.object({
      userStoryNumber: z.string(),
      userStoryLink: z.string(),
      prLinks: z.array(z.string()),
      codeDescription: z.string(),
      pipelineBuildLinks: z.array(z.string()),
      environmentDeployLinks: z.array(z.string()),
    })
  ),

  whoCreatedIt: z.object({
    name: z.string(),
    empId: z.string(),
    totalTime: z.number(),
  }),

  retrospectiveSection: z.array(z.any()),
});
export const updateDocumentSchema = z.object({
  requirementElicitation: z.object({
    startTime: z.string().optional(),
    discussion: z.string().optional(),
    endTime: z.string().optional(),
  }).optional(),

  feature: z.object({
    featureName: z.string().optional(),
    featureDescription: z.object({
      startTime: z.string().optional(),
      requirementAnalysis: z.string().optional(),
      endTime: z.string().optional(),
    }).optional(),
  }).optional(),

  designDiagram: z.object({
    diagramId: z.string().min(1),
  }).optional(),

  featureEstimate: z.object({
    userStoryDistribution: z.array(z.any()).optional(),
  }).optional(),

  trackingAndReleaseDetails: z.array(
    z.object({
      userStoryNumber: z.string(),
      userStoryLink: z.string(),
      prLinks: z.array(z.string()),
      codeDescription: z.string(),
      pipelineBuildLinks: z.array(z.string()),
      environmentDeployLinks: z.array(z.string()),
    })
  ).optional(),

  whoCreatedIt: z.object({
    name: z.string(),
    empId: z.string(),
    totalTime: z.number(),
  }).optional(),

  retrospectiveSection: z.array(z.any()).optional(),
});
export const documentIdSchema = z.object({
    id:z.string().min(1),
})