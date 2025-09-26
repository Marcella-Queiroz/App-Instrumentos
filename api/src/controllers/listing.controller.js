import { listingCreateSchema, listingStatusSchema } from "../validators/listing.validator.js";
import * as Repo from "../repositories/listing.repo.js";

export async function index(req, res) {
  const { search, category, priceMin, priceMax, page, limit } = req.query;
  const result = await Repo.listListings({
    search,
    category,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10
  });
  res.json(result);
}

export async function show(req, res) {
  const l = await Repo.getListingById(req.params.id);
  if (!l) return res.status(404).json({ error: "Anúncio não encontrado" });
  res.json(l);
}

export async function store(req, res) {
  const { error, value } = listingCreateSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

  const created = await Repo.createListing(req.user.id, value);
  res.status(201).json(created);
}

export async function changeStatus(req, res) {
  const { error, value } = listingStatusSchema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ error: error.details.map(d => d.message) });

  const updated = await Repo.updateStatus(req.params.id, req.user.id, value.status);
  if (!updated) return res.status(404).json({ error: "Anúncio não encontrado ou não é seu" });
  res.json(updated);
}
