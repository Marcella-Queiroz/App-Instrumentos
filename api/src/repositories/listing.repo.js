import { getDb } from "../db.js";

export async function createListing(userId, payload) {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO listings (userId, title, description, price, acceptsTrade, condition, category, city)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    userId, payload.title, payload.description ?? "", payload.price,
    payload.acceptsTrade ? 1 : 0, payload.condition, payload.category, payload.city ?? null
  );
  const listingId = result.lastID;

  // salva fotos (URLs)
  for (const url of payload.photos ?? []) {
    await db.run(
      `INSERT INTO listing_photos (listingId, url) VALUES (?, ?)`,
      listingId, url
    );
  }

  return getListingById(listingId);
}

export async function getListingById(id) {
  const db = await getDb();
  const listing = await db.get(
    `SELECT l.*, u.name as sellerName, u.email as sellerEmail
       FROM listings l
       JOIN users u ON u.id = l.userId
      WHERE l.id = ?`, id
  );
  if (!listing) return null;
  const photos = await db.all(`SELECT id, url FROM listing_photos WHERE listingId = ? ORDER BY id`, id);
  return { ...listing, acceptsTrade: !!listing.acceptsTrade, photos };
}

export async function listListings({ search, category, priceMin, priceMax, page=1, limit=10 }) {
  const db = await getDb();
  const where = [];
  const params = [];

  if (search) {
    where.push("(l.title LIKE ? OR l.description LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    where.push("l.category = ?");
    params.push(category);
  }
  if (priceMin != null) {
    where.push("l.price >= ?");
    params.push(priceMin);
  }
  if (priceMax != null) {
    where.push("l.price <= ?");
    params.push(priceMax);
  }
  // exibir só ativos no feed
  where.push("l.status = 'active'");

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const offset = (Number(page)-1) * Number(limit);

  const items = await db.all(
    `SELECT l.id, l.title, l.price, l.category, l.condition, l.city, l.createdAt,
            (SELECT url FROM listing_photos p WHERE p.listingId = l.id ORDER BY p.id LIMIT 1) as photo
       FROM listings l
       ${whereSql}
      ORDER BY l.createdAt DESC
      LIMIT ? OFFSET ?`,
    ...params, Number(limit), Number(offset)
  );

  const totalRow = await db.get(
    `SELECT COUNT(*) as total FROM listings l ${whereSql}`, ...params
  );

  return { items, page: Number(page), limit: Number(limit), total: totalRow.total };
}

export async function updateStatus(id, userId, status) {
  const db = await getDb();
  // só o dono pode mudar
  const owning = await db.get(`SELECT id FROM listings WHERE id = ? AND userId = ?`, id, userId);
  if (!owning) return null;

  await db.run(`UPDATE listings SET status = ? WHERE id = ?`, status, id);
  return getListingById(id);
}
