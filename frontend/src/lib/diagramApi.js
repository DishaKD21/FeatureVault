const API_BASE = "http://localhost:5000/api";

/**
 * Convert base64 data URL to Blob for FormData upload
 */
function dataURLtoBlob(dataURL) {
  const [header, base64] = dataURL.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
}

/**
 * Create a new diagram (first time)
 * Sends as FormData so multer can save the image file to disk
 */
export const createDiagram = async (payload) => {
  const formData = new FormData();

  // Send diagramJson as a JSON string field
  formData.append("json", JSON.stringify(payload.diagramJson));

  // Send documentId if present
  if (payload.documentId) {
    formData.append("documentId", payload.documentId);
  }

  // Send image as a file blob (not base64 string)
  if (payload.diagramImage) {
    const blob = dataURLtoBlob(payload.diagramImage);
    formData.append("image", blob, "diagram.png");
    console.log("[diagramApi] Image blob size:", (blob.size / 1024).toFixed(1), "KB");
  }

  console.log("[diagramApi] Creating diagram via FormData...");

  const res = await fetch(`${API_BASE}/diagram/create`, {
    method: "POST",
    body: formData,
    // DO NOT set Content-Type header — browser sets it with boundary automatically
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create diagram: ${res.status} ${errText}`);
  }

  return res.json();
};

/**
 * Update an existing diagram
 * Sends as FormData so multer can replace the image file on disk
 */
export const updateDiagram = async (payload) => {
  const formData = new FormData();

  // Send diagramJson as a JSON string field
  if (payload.diagramJson) {
    formData.append("json", JSON.stringify(payload.diagramJson));
  }

  // Send image as a file blob
  if (payload.diagramImage) {
    const blob = dataURLtoBlob(payload.diagramImage);
    formData.append("image", blob, "diagram.png");
    console.log("[diagramApi] Image blob size:", (blob.size / 1024).toFixed(1), "KB");
  }

  console.log("[diagramApi] Updating diagram", payload.id, "via FormData...");

  const res = await fetch(`${API_BASE}/diagram/update/${payload.id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to update diagram: ${res.status} ${errText}`);
  }

  return res.json();
};

/**
 * Fetch diagram by document ID
 */
export const getDiagramByDocumentId = async (documentId) => {
  const res = await fetch(`${API_BASE}/diagram/by-document/${documentId}`);

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch diagram: ${res.statusText}`);
  }

  return res.json();
};

/**
 * Fetch diagram by diagram ID
 */
export const getDiagramById = async (diagramId) => {
  const res = await fetch(`${API_BASE}/diagram/${diagramId}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch diagram: ${res.statusText}`);
  }

  return res.json();
};

/**
 * Delete a diagram
 */
export const deleteDiagram = async (diagramId) => {
  const res = await fetch(`${API_BASE}/diagram/delete/${diagramId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete diagram: ${res.statusText}`);
  }

  return res.json();
};