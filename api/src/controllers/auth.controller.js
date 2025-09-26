import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDb } from "../db.js";

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  city: Joi.string().allow("", null),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export async function register(req, res) {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

  const db = await getDb();
  const exists = await db.get("SELECT id FROM users WHERE email = ?", value.email);
  if (exists) return res.status(409).json({ error: "E-mail já cadastrado" });

  const passwordHash = await bcrypt.hash(value.password, 10);
  const result = await db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    value.name, value.email, passwordHash
  );

  const user = { id: result.lastID, name: value.name, email: value.email };
  return res.status(201).json(user);
}

export async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

  const db = await getDb();
  const user = await db.get("SELECT * FROM users WHERE email = ?", value.email);
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const ok = await bcrypt.compare(value.password, user.password);
  if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET || "dev-secret",
    { subject: String(user.id), expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  // não devolvemos o hash
  return res.json({
    access_token: token,
    user: { id: user.id, name: user.name, email: user.email }
  });
}
