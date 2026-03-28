import { Router } from "express";
import * as controller from "./documentation.controller.js";
import * as zod from "./documentation.validation.js";

const documentationRouter = Router();

documentationRouter.get("/documentation", controller.getAllDocuments);
documentationRouter.get("/documentation/:id",validate(zod.documentIdSchema, "params"),controller.getDocumentById);
documentationRouter.post("/documentation",validate(zod.createDocumentSchema),controller.createDocument);
documentationRouter.put("/documentation/:id",validate(zod.documentIdSchema, "params"),validate(zod.updateDocumentSchema),controller.updateDocument);
documentationRouter.delete("/documentation/:id",validate(zod.documentIdSchema, "params"),controller.deleteDocument);

export default documentationRouter;