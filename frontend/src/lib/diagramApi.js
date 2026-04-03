export async function postDiagram({ diagramJson, diagramImage }) {
  const formData = new FormData();

  formData.append("diagramJson", JSON.stringify(diagramJson));

  if (diagramImage) {
    const res = await fetch(diagramImage);
    const blob = await res.blob();
    formData.append("image", blob, "diagram.png");
  }

  const response = await fetch("http://localhost:5000/api/diagram/create", {
    method: "POST",
    body: formData,
  });

  return response.json();
}