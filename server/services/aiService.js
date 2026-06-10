const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export async function generateDiagramExplanation({ documentId, diagramId }) {
  // ==========================================
  // Feature flag logic
  // ==========================================
  const aiEnabled = process.env.AI_SERVICE_ENABLED !== "false";

  if (!aiEnabled) {
    // ==========================================
    // Mock response logic (Case 1)
    // ==========================================
    // Immediately return the predefined response structure if the AI service is disabled.
    return {
      success: true,
      aiEnabled: false,
      source: "mock",
      explanation: "AI service is currently unavailable in this deployment environment."
    };
  }

  // ==========================================
  // Original AI implementation
  // ==========================================
  try {
    const res = await fetch(`${AI_SERVICE_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, diagramId }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`AI service error: ${res.status} ${errText}`);
    }

    return await res.json();
  } catch (error) {
    // ==========================================
    // Fallback logic when service is unreachable (Case 3)
    // ==========================================
    // Do not throw an exception that crashes/breaks requests. Return a clean fallback.
    console.error("AI service communication failed, returning fallback:", error.message);
    return {
      success: true,
      aiEnabled: false,
      source: "fallback",
      explanation: "AI service is currently unavailable."
    };
  }
}

