import { Router } from "express";
import { createShortUrl, redirectUrl } from "../controllers/urlController.js";
import authenticateUser from "../middleware/auth.js";
const router = Router();

router.post("/shorten", authenticateUser, createShortUrl);
router.get("/shorten/:alias",authenticateUser, redirectUrl);

export default router;
