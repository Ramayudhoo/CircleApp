import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createThread,
  getThreads,
  toggleLike,
} from "../controllers/thread.controller";

const router = Router();

router.get("/", authMiddleware, getThreads);
router.post("/:id/like", authMiddleware, toggleLike);
router.post("/", authMiddleware, createThread);
export default router;
