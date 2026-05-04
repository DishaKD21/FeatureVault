import Document from "./documentation.model.js";

export const createDraft = async (createdBy) => {
  const draft = await Document.create({
    status: "draft",
    createdBy,

  });
  return draft;
};

export const updateDraft = async (id, createdBy, data) => {
  return await Document.findOneAndUpdate(
    { _id: id, createdBy },
    { ...data, status: "draft" },
    { returnDocument: "after", runValidators: false }
  );
};

export const submitDocument = async (id, createdBy, data) => {
  const submission = { ...data, status: "completed" };

  return await Document.findOneAndUpdate(
    { _id: id, createdBy },
    submission,
    {
      returnDocument: "after",
      runValidators: true
    }
  );
};

export const getAllDocuments = async (createdBy) => {
  return await Document.find({ createdBy }).sort({ createdAt: -1 });
};

export const getDocumentById = async (id, createdBy) => {
  return await Document.findOne({ _id: id, createdBy });
};

export const deleteDocument = async (id, createdBy) => {
  return await Document.findOneAndDelete({ _id: id, createdBy });
};
