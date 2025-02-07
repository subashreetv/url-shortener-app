import { Router } from "express";
import { getAnalytics, getTopicAnalytics, getOverallAnalytics } from "../controllers/analyticsController.js";
import authenticateUser from "../middleware/auth.js";
const router = Router();

router.get("/analytics/overall", authenticateUser, getOverallAnalytics);
router.get("/analytics/:alias", authenticateUser, getAnalytics);
router.get("/analytics/topic/:topic", authenticateUser, getTopicAnalytics);

export default router;
