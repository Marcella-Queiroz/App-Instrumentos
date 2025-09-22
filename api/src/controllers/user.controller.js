import { userCreateSchema, userUpdateSchema } from "../validators/user.validator.js";
import * as Repo from "../repositories/user.repo.js";

export async function index(_req, res) {
  const users = await Repo.listUsers();
  res.json(users);
}

export async function show(req, res) {
  const user = await Repo.getUser(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(user);
}

export async function store(req, res) {
  const { error, value } = userCreateSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

  const user = await Repo.createUser(value);
  res.status(201).json(user);
}

export async function update(req, res) {
  const { error, value } = userUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

  const user = await Repo.updateUser(req.params.id, value);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(user);
}

export async function destroy(req, res) {
  const ok = await Repo.deleteUser(req.params.id);
  if (!ok) return res.status(404).json({ error: "Usuário não encontrado" });
  res.status(204).send();
}
