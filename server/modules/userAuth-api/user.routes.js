import express from "express";
import { verifyToken } from "./middleware.js";

const router = express.Router();

router.post("/auth/firebase", verifyToken, (req, res) => {
	return res.status(200).json(req.user);
});

export default router;