/**
 * diagramStore.js
 * ─────────────────────────────────────────────────────────────────
 * localStorage-based state bridge for diagram data between pages.
 *
 * Stores:
 *   - diagramJson          – nodes + edges for reconstructing the editor
 *   - diagramImageDataUrl  – PNG base64 data URL from html-to-image
 *                            (or hosted URL when backend becomes available)
 *
 * NOTE: This is an intentional interim solution.
 * TODO: Replace with backend persistence (POST/GET /api/diagrams)
 *       for multi-device support once backend endpoints are ready.
 * ─────────────────────────────────────────────────────────────────
 */

export const DIAGRAM_STORAGE_KEY = 'featurevault_diagram';

/**
 * Save diagram data to localStorage.
 * @param {{ diagramJson: object, diagramImageDataUrl: string|null }} data
 */
export function saveDiagram({ diagramJson, diagramImageDataUrl }) {
  try {
    const payload = {
      diagramJson,
      diagramImageDataUrl,   // PNG data URL from html-to-image
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DIAGRAM_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('[diagramStore] Failed to save diagram:', err);
  }
}

/**
 * Load diagram data from localStorage.
 * @returns {{ diagramJson: object, diagramImageDataUrl: string|null, savedAt: string } | null}
 */
export function loadDiagram() {
  try {
    const raw = localStorage.getItem(DIAGRAM_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('[diagramStore] Failed to load diagram:', err);
    return null;
  }
}

/**
 * Clear diagram data from localStorage.
 */
export function clearDiagram() {
  try {
    localStorage.removeItem(DIAGRAM_STORAGE_KEY);
  } catch (err) {
    console.error('[diagramStore] Failed to clear diagram:', err);
  }
}

