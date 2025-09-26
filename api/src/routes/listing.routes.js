import { Router } from "express";
import * as Listing from "../controllers/listing.controller.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", Listing.index);
router.get("/:id", Listing.show);
router.post("/", authMiddleware, Listing.store);
router.patch("/:id/status", authMiddleware, Listing.changeStatus);

export default router;
