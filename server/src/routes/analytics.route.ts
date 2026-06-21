import { Router } from "express";
import {
  getSummary,
  getTopThreads,
  getActivity,
} from "../controllers/analytics.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/summary", authMiddleware, getSummary);
router.get("/top-threads", authMiddleware, getTopThreads);
router.get("/activity", authMiddleware, getActivity);

export default router;
