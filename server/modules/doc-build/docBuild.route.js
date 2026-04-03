import express from "express";
import * as controller from "./docBuild.controller.js";

const DocGenerationRouter = express.Router();

DocGenerationRouter.get("/documentation/:id/export", controller.exportDocument);

export default DocGenerationRouter;