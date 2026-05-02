import API_URL from "../config";
const API_BASE = `${API_URL}/api`;

export const createDraft = async () => {
  const res = await fetch(`${API_BASE}/documentation/create-draft`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    throw new Error(`Failed to create draft: ${res.statusText}`);
  }
  return res.json();
};

export const getDocumentById = async (id) => {
  const res = await fetch(`${API_BASE}/documentation/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch document: ${res.statusText}`);
  return res.json();
};

export const updateDraft = async (id, data) => {
  const res = await fetch(`${API_BASE}/documentation/update-draft/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to update draft: ${res.status} ${errText}`);
  }
  return res.json();
};

export const submitDocument = async (id, data) => {
  const res = await fetch(`${API_BASE}/documentation/submit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to submit document: ${res.status} ${errText}`);
  }
  return res.json();
};

export const getAllDocuments = async () => {
  const res = await fetch(`${API_BASE}/documentation`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
};

export const deleteDocument = async (id) => {
  const res = await fetch(`${API_BASE}/documentation/delete/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete document");
  return res.json();
};

export const exportDocument = async (id, filename = "document") => {
  try {
    const res = await fetch(`${API_BASE}/documentation/${id}/export`);
    if (!res.ok) throw new Error("Export failed");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed:", err);
    alert("Download failed: " + err.message);
  }
};
