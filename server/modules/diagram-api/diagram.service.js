import Diagram from "./diagram.model.js";

export const createDiagram = async (data) => {
  return await Diagram.create(data);
};

export const getAllDiagrams = async (createdBy) => {
  return await Diagram.find({ createdBy }).sort({ createdAt: -1 });
};

export const getDiagramById = async (id, createdBy) => {
  return await Diagram.findOne({ _id: id, createdBy });
};

export const getDiagramByDocumentId = async (documentId, createdBy) => {
  return await Diagram.findOne({ documentId, createdBy });
};

export const updateDiagram = async (id, createdBy, data) => {
  return await Diagram.findOneAndUpdate({ _id: id, createdBy }, data, { new: true });
};

export const deleteDiagram = async (id, createdBy) => {
  return await Diagram.findOneAndDelete({ _id: id, createdBy });
};
