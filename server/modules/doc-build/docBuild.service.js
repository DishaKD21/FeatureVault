import { Packer } from "docx";
import { buildDocument } from "../../utils/documentBuilder.js";
import Documentation from "../../modules/documentation-api/documentation.model.js";
import Diagram from "../../modules/diagram-api/diagram.model.js";

export async function generateDocBufferById(id) {
  const data = await Documentation.findById(id).lean();

  if (!data) {
    throw new Error("Document not found");
  }

  if (data.designDiagram?.diagramId) {
    const diagram = await Diagram.findById(data.designDiagram.diagramId).lean();

    if (diagram?.image) {
      data.designDiagram.imageLink = diagram.image;
    }
  }

  const doc = await buildDocument(data);

  return await Packer.toBuffer(doc);
}