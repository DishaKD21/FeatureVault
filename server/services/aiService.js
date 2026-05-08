const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function generateDiagramExplanation({ documentId, diagramId }) {
  const res = await fetch(`${AI_SERVICE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentId, diagramId }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI service error: ${res.status} ${errText}`);
  }

  return res.json();
}
