import Diagram from "./diagram.model.js";

export const createDiagram = async (data) => {
  return await Diagram.create(data);
};

export const getAllDiagrams = async () => {
  return await Diagram.find();
};

export const getDiagramById = async (id) => {
  return await Diagram.findById(id);
};

export const updateDiagram = async (id, data) => {
  return await Diagram.findByIdAndUpdate(id, data, { new: true });
};

export const deleteDiagram = async (id) => {
  return await Diagram.findByIdAndDelete(id);
};