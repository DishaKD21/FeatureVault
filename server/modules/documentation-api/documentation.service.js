import Document from "./documentation.model.js";

export const createDraft = async () => {
  const draft = await Document.create({
    status: "draft"

  });
  return draft;
};

export const updateDraft = async (id, data) => {
  return await Document.findByIdAndUpdate(
    id,
    { ...data, status: "draft" },
    { returnDocument: "after", runValidators: false }
  );
};

export const submitDocument = async (id, data) => {
  const submission = { ...data, status: "completed" };

  return await Document.findByIdAndUpdate(
    id,
    submission,
    {
      returnDocument: "after",
      runValidators: true
    }
  );
};

export const getAllDocuments = async () => {
  return await Document.find().sort({ createdAt: -1 });
};

export const getDocumentById = async (id) => {
  return await Document.findById(id);
};

export const deleteDocument = async (id) => {
  return await Document.findByIdAndDelete(id);
};