import express from "express";
import * as controller from "./docBuild.controller.js";
import { verifyToken } from "../userAuth-api/middleware.js";

const DocGenerationRouter = express.Router();

DocGenerationRouter.get("/documentation/:id/export", verifyToken, controller.exportDocument);

export default DocGenerationRouter;
