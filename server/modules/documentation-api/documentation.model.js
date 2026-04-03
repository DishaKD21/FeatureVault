import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    requirementElicitation: {
      startTime: Date,
      discussion: String,
      endTime: Date,
    },
    feature: {
    featureName: String,
    featureDescription: {
      startTime: Date,
      requirementAnalysis: String,
      endTime: Date,
    }
  },
    designDiagram: {
      diagramId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagrams",
        default: null,
      },
    },
    featureEstimate: {
  userStoryDistribution: [
    {
      type: mongoose.Schema.Types.Mixed
    }
  ]
},
    trackingAndReleaseDetails: [
      {
        userStoryNumber: String,
        userStoryLink: String,
        prLinks: [String],
        codeDescription: String,
        pipelineBuildLinks: [String],
        environmentDeployLinks: [String],
      },
    ],
    whoCreatedIt: {
      name: String,
      empId: String,
      totalTime: Number,
    },
    retrospectiveSection: [{
      type: mongoose.Schema.Types.Mixed,
    }],
  },
  { timestamps: true },
);

export default mongoose.model("Documentations", documentSchema);
