
const API_BASE = "http://localhost:5000/api";

/**
 * Create a draft document (empty shell with status: "draft")
 */
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

/**
 * Fetch document by ID (for loading draft data into form)
 */
export const getDocumentById = async (id) => {
  const res = await fetch(`${API_BASE}/documentation/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch document: ${res.statusText}`);
  }

  return res.json();
};

/**
 * Update draft document (partial update, preserves existing fields)
 */
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
