import Document from "./documentation.model";

export const createDocument = async (data) => {
  return await Document.create(data);
};

export const getAllDocuments = async () => {
  return await Document.find().sort({ createdAt: -1 });
};

export const getDocumentById = async (id) => {
  return await Document.findById(id);
};

export const updateDocument = async (id, data) => {
  return await Document.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteDocument = async (id) => {
  return await Document.findByIdAndDelete(id);
};