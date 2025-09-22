import express from "express";
import cors from "cors";
import { getDb } from "./db.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middlewares/error.js";

const app = express();
app.use(cors());
app.use(express.json());

// inicia/cria o banco
await getDb();

// rota de saúde
app.get("/health", (_req, res) => res.json({ ok: true }));

// rotas de usuários
app.use("/users", userRoutes);

// erro global
app.use(errorHandler);

// sobe o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 API rodando em http://localhost:${PORT}`));
