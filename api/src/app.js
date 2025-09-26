// api/src/app.js (ESM, versão final)
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

// Middlewares básicos
app.use(cors({ origin: "*" }));
app.use(express.json());

// Healthchecks
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/saude", (_req, res) =>
  res.json({
    ok: true,
    env: process.env.NODE_ENV || "dev",
    uptime: process.uptime(),
    now: new Date().toISOString(),
  })
);

// __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Arquivos estáticos (uploads na raiz do projeto)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Rotas
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/listings", listingRoutes);

// Tratador de erros
app.use(errorMiddleware);

export default app;
