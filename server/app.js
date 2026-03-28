import express from "express";
import cors from "cors";
import authRoutes from "./modules/userAuth-api/user.routes.js";
import documentationRouter from "./modules/documentation-api/documentation.routes.js";
import diagramRouter from "./modules/diagram-api/diagram.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api",documentationRouter);
app.use("/api",diagramRouter);
app.get("/", (req, res) => {
  res.send("API Running...");
});

export default app;