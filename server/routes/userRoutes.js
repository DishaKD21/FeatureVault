import express from "express";
import { firebaseLogin } from "../controller/userController.js";
import { verifyToken } from "../middleware.js";

const router = express.Router();

router.post("/firebase", verifyToken, firebaseLogin);

export default router;