import { Router } from "express";
import * as controller from "./diagram.controller.js";
import { validate } from "../middlewares/validate.js";
import * as zod from "./diagram.validation.js";

const diagramRouter = Router();

diagramRouter.get("/diagram", controller.getAllDiagrams);
diagramRouter.get("/diagram/:id",validate(zod.diagramIdSchema, "params"),controller.getDiagramById);
diagramRouter.post("/diagram",validate(zod.createDiagramSchema),controller.createDiagram);
diagramRouter.put("/diagram/:id", validate(zod.diagramIdSchema, "params"),validate(zod.updateDiagramSchema),controller.updateDiagram);
diagramRouter.delete("/diagram/:id",validate(zod.diagramIdSchema, "params"),controller.deleteDiagram);

export default diagramRouter;
