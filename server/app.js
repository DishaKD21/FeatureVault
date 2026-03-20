import express from "express";
import cors from "cors";
import authRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Test route (optional)
app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;