import { getDb } from "../db.js";

export async function listUsers() {
  const db = await getDb();
  return db.all("SELECT id, name, email, createdAt FROM users ORDER BY createdAt DESC");
}

export async function getUser(id) {
  const db = await getDb();
  return db.get("SELECT id, name, email, createdAt FROM users WHERE id = ?", id);
}

export async function createUser({ name, email, password }) {
  const db = await getDb();
  const result = await db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    name,
    email,
    password
  );
  return getUser(result.lastID);
}

export async function updateUser(id, { name, email, password }) {
  const db = await getDb();
  const existing = await db.get("SELECT * FROM users WHERE id = ?", id);
  if (!existing) return null;

  await db.run(
    "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
    name ?? existing.name,
    email ?? existing.email,
    password ?? existing.password,
    id
  );

  return getUser(id);
}

export async function deleteUser(id) {
  const db = await getDb();
  const res = await db.run("DELETE FROM users WHERE id = ?", id);
  return res.changes > 0;
}
