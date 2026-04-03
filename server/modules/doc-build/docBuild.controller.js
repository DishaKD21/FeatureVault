import { generateDocBufferById } from "./docBuild.service.js";

export async function exportDocument(req, res) {
  try {
    const { id } = req.params;

    const buffer = await generateDocBufferById(id);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=document.docx"
    );

    res.send(buffer);

  } catch (err) {
    console.error(err);

    if (err.message === "Document not found") {
      return res.status(404).json({ message: err.message });
    }

    res.status(500).json({ message: "Error generating document" });
  }
}