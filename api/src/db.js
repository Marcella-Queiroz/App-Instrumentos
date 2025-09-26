import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function getDb() {
  const db = await open({
    filename: "./users.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      acceptsTrade INTEGER NOT NULL DEFAULT 0,
      condition TEXT NOT NULL CHECK (condition IN ('novo','semi-novo','usado')),
      category TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','sold')),
      city TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS listing_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listingId INTEGER NOT NULL,
      url TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`CREATE INDEX IF NOT EXISTS idx_listings_createdAt ON listings(createdAt DESC)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category)`);
  await db.exec(`CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price)`);


  return db;
}
