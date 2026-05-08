import mongoose from "mongoose";

const diagramSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    json: mongoose.Schema.Types.Mixed,
    image: String,
    explanation: {
      
      type: String,
      default: "",
    },

    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Documentations",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Diagrams", diagramSchema);
