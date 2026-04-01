import { Router } from "express";
import * as controller from "./diagram.controller.js";
import * as zod from "./diagram.validation.js";
import validate from "../../utils/validate.js";

const diagramRouter = Router();

diagramRouter.get("/diagram", controller.getAllDiagrams);
diagramRouter.get("/diagram/:id",validate(zod.diagramIdSchema, "params"),controller.getDiagramById);
diagramRouter.post("/diagram/create",validate(zod.createDiagramSchema),controller.createDiagram);
diagramRouter.put("/diagram/update/:id", validate(zod.diagramIdSchema, "params"),validate(zod.updateDiagramSchema),controller.updateDiagram);
diagramRouter.delete("/diagram/delete/:id",validate(zod.diagramIdSchema, "params"),controller.deleteDiagram);

export default diagramRouter;
