import { Router } from "express";
import * as controller from "./documentation.controller.js";
import * as zod from "./documentation.validation.js";
import validate from "../../utils/validate.js";

const documentationRouter = Router();

documentationRouter.get("/documentation", controller.getAllDocuments);
documentationRouter.get("/documentation/:id",validate(zod.documentIdSchema, "params"),controller.getDocumentById);
documentationRouter.post("/documentation/create",validate(zod.createDocumentSchema),controller.createDocument);
documentationRouter.put("/documentation/update/:id",validate(zod.documentIdSchema, "params"),validate(zod.updateDocumentSchema),controller.updateDocument);
documentationRouter.delete("/documentation/delete/:id",validate(zod.documentIdSchema, "params"),controller.deleteDocument);

export default documentationRouter;