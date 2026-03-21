import express from "express";
import { firebaseLogin } from "./user.controller.js";
import { verifyToken } from "./middleware.js";

const router = express.Router();

router.post("/firebase", verifyToken, firebaseLogin);

export default router;