/**
 * diagramApi.js
 * ─────────────────────────────────────────────────────────────────
 * API integration for persisting diagrams in the backend.
 *
 * Flow:
 *  1. uploadDiagramImage(dataUrl)  → uploads PNG file → returns hosted image URL
 *  2. postDiagram({ diagramJson, diagramImageUrl }) → saves JSON + image URL
 *
 * On re-save (Edit), uploadDiagramImage is called again, returning a
 * new or overwritten URL, which is then sent to postDiagram to update
 * the diagram_image path in the backend.
 *
 * TODO: Set NEXT_PUBLIC_API_BASE_URL in .env.local when backend is ready.
 * ─────────────────────────────────────────────────────────────────
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * Convert a base64 data URL to a Blob.
 * @param {string} dataUrl  e.g. "data:image/png;base64,..."
 * @returns {Blob}
 */
function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Upload a PNG diagram image to the backend.
 * Converts base64 data URL → Blob → multipart/form-data POST.
 *
 * @param {string} dataUrl  PNG data URL from html-to-image
 * @returns {Promise<string|null>}  Hosted image URL, or null on failure
 *
 * TODO: Backend should accept POST /api/diagrams/upload-image
 *       with a multipart field named "file", and return { url: "https://..." }
 */
export async function uploadDiagramImage(dataUrl) {
  if (!dataUrl) return null;
  try {
    const blob = dataUrlToBlob(dataUrl);
    const formData = new FormData();
    formData.append('file', blob, `diagram_${Date.now()}.png`);

    const res = await fetch(`${BASE_URL}/api/diagrams/upload-image`, {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type — browser sets multipart boundary automatically
    });

    if (!res.ok) {
      console.warn('[diagramApi] Image upload failed with status:', res.status);
      return null;
    }

    const data = await res.json();
   
    return data?.url ?? null;
  } catch (err) {
    console.error('[diagramApi] uploadDiagramImage failed:', err);
    return null;
  }
}

/**
 * Save/update a diagram in the backend with JSON + hosted image URL.
 *
 * @param {{ diagramJson: object, diagramImageUrl: string|null, diagramId?: string }} payload
 * @returns {Promise<object|null>}
 *
 * TODO: If diagramId is provided → PUT /api/diagrams/:id (update)
 *       Otherwise              → POST /api/diagrams (create)
 *       Backend stores: { diagram_json, diagram_image (URL), updated_at }
 */
export async function postDiagram({ diagramJson, diagramImageUrl, diagramId }) {
  try {
    const method = diagramId ? 'PUT' : 'POST';
    const url = diagramId
      ? `${BASE_URL}/api/diagrams/${diagramId}`
      : `${BASE_URL}/api/diagrams`;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diagram_json: diagramJson,
        diagram_image: diagramImageUrl, // URL path, not base64
      }),
    });

    if (!res.ok) {
      console.warn('[diagramApi] postDiagram responded with status:', res.status);
      return null;
    }

    return await res.json();
    // Expected response: { id, diagram_json, diagram_image, created_at, updated_at }
  } catch (err) {
    console.error('[diagramApi] postDiagram failed:', err);
    return null;
  }
}

/**
 * Fetch a saved diagram from the backend.
 * @param {string} diagramId
 * @returns {Promise<object|null>}
 */
export async function getDiagram(diagramId) {
  try {
    const res = await fetch(`${BASE_URL}/api/diagrams/${diagramId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('[diagramApi] getDiagram failed:', err);
    return null;
  }
}

