import { Router } from "express";
import * as controller from "./diagram.controller.js";
import * as zod from "./diagram.validation.js";
import validate from "../../utils/validate.js";
import multer from "multer";
import { verifyToken } from "../userAuth-api/middleware.js";

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "upload/diagram"),
	filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const diagramRouter = Router();

diagramRouter.get("/diagram", verifyToken, controller.getAllDiagrams);
diagramRouter.get("/diagram/by-document/:documentId", verifyToken, validate(zod.documentIdSchema, "params"), controller.getDiagramByDocumentId);
diagramRouter.get("/diagram/:id", verifyToken, validate(zod.diagramIdSchema, "params"), controller.getDiagramById);
diagramRouter.post("/diagram/create", verifyToken, upload.single("image"), validate(zod.createDiagramSchema), controller.createDiagram);
diagramRouter.put("/diagram/update/:id", verifyToken, upload.single("image"), validate(zod.diagramIdSchema, "params"), validate(zod.updateDiagramSchema), controller.updateDiagram);
diagramRouter.delete("/diagram/delete/:id", verifyToken, validate(zod.diagramIdSchema, "params"), controller.deleteDiagram);

export default diagramRouter;
