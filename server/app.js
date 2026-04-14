import express from "express";
import cors from "cors";
import authRoutes from "./modules/userAuth-api/user.routes.js";
import documentationRouter from "./modules/documentation-api/documentation.routes.js";
import diagramRouter from "./modules/diagram-api/diagram.routes.js";
import DocGenerationRouter from "./modules/doc-build/docBuild.route.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve uploaded files statically (e.g. diagram images)
app.use("/upload", express.static("upload"));

// Routes
app.use("/api", authRoutes);
app.use("/api",documentationRouter);
app.use("/api",diagramRouter);
app.use("/api",DocGenerationRouter);
app.get("/", (req, res) => {
  res.send("API Running...");
});
export default app;