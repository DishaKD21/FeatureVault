import { Router } from "express";
import * as controller from "./diagram.controller.js";
import * as zod from "./diagram.validation.js";
import validate from "../../utils/validate.js";
import multer from "multer";

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "upload/diagram"),
	filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const diagramRouter = Router();

diagramRouter.get("/diagram", controller.getAllDiagrams);
diagramRouter.get("/diagram/:id",validate(zod.diagramIdSchema, "params"),controller.getDiagramById);
diagramRouter.post("/diagram/create", upload.single("image"), validate(zod.createDiagramSchema), controller.createDiagram);
diagramRouter.put("/diagram/update/:id", validate(zod.diagramIdSchema, "params"),validate(zod.updateDiagramSchema),controller.updateDiagram);
diagramRouter.delete("/diagram/delete/:id",validate(zod.diagramIdSchema, "params"),controller.deleteDiagram);

export default diagramRouter;
