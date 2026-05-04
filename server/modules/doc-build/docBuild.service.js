import { Packer } from "docx";
import { buildDocument } from "../../utils/documentBuilder.js";
import Documentation from "../../modules/documentation-api/documentation.model.js";
import Diagram from "../../modules/diagram-api/diagram.model.js";

export async function generateDocBufferById(id, createdBy) {
  const data = await Documentation.findOne({ _id: id, createdBy }).lean();

  if (!data) {
    throw new Error("Document not found");
  }

  if (data.designDiagram?.diagramId) {
    const diagram = await Diagram.findOne({
      _id: data.designDiagram.diagramId,
      createdBy,
    }).lean();

    if (diagram?.image) {
      data.designDiagram.imageLink = diagram.image;
    }
  }

  const doc = await buildDocument(data);

  return await Packer.toBuffer(doc);
}
