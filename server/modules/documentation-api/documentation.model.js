import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    requirementElicitation: {
      startTime: Date,
      discussion: String,
      endTime: Date,
    },
    featureName: {
      type: String,
      required: true,
      trim: true,
    },
    featureDescription: {
      startTime: Date,
      requirementAnalysis: String,
      endTime: Date,
    },
    designDiagram: {
      diagramId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagrams",
        default: null,
      },
    },
    featureEstimate: {
      type: mongoose.Schema.Types.Mixed,
    },
    userStoryDistribution: [
      {
        userStoryNumber: String,
        employeeEmailId: {
          type: String,
          match: /.+\@.+\..+/,
        },
        developerName: String,
        startTime: Date,
        endTime: Date,
      },
    ],
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
