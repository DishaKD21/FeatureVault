export const createDocumentSchema = z.object({
  featureName: z.string().min(1),
  requirementElicitation: z.object({
    startTime: z.string(),
    discussion: z.string(),
    endTime: z.string(),
  }),

  featureDescription: z.object({
    startTime: z.string(),
    requirementAnalysis: z.string(),
    endTime: z.string(),
  }),

  designDiagram: z.string(),

  featureEstimate: z.any(),

  userStoryDistribution: z.array(
    z.object({
      userStoryNumber: z.string(),
      employeeEmailId: z.string().email(),
      developerName: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })
  ),

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

  retrospectiveSection: z.any(),
});
export const updateDocumentSchema = z.createDocumentSchema.partial();
export const documentIdSchema = z.object({
    id:z.string().min(1),
})