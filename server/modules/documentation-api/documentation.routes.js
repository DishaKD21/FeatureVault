import { Router } from "express";
import * as controller from "./documentation.controller.js";
import * as zod from "./documentation.validation.js";
import validate from "../../utils/validate.js";

const documentationRouter = Router();
documentationRouter.get("/documentation", controller.getAllDocuments);
documentationRouter.get("/documentation/:id", validate(zod.documentIdSchema, "params"), controller.getDocumentById);
documentationRouter.delete("/documentation/delete/:id", validate(zod.documentIdSchema, "params"), controller.deleteDocument);
documentationRouter.post("/documentation/create-draft",validate(zod.createDraftSchema),controller.createDraft);
documentationRouter.put("/documentation/update-draft/:id",validate(zod.documentIdSchema, "params"),validate(zod.updateDraftSchema),controller.updateDraft);
documentationRouter.put("/documentation/submit/:id",validate(zod.documentIdSchema, "params"),validate(zod.submitDocumentSchema),controller.submitDocument);
export default documentationRouter;