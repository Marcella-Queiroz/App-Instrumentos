import { Router } from "express";
import * as User from "../controllers/user.controller.js";

const router = Router();

router.get("/", User.index);
router.get("/:id", User.show);
router.post("/", User.store);
router.put("/:id", User.update);
router.delete("/:id", User.destroy);

export default router;
