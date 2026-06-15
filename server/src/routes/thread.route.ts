import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createThread,
  getThreads,
  toggleLike,
  getFollowingThreads,
  getThreadDetail,
  getThreadReplies,
} from "../controllers/thread.controller";
import upload from "../lib/multer";

const router = Router();

router.get("/", authMiddleware, getThreads);
router.get("/following", authMiddleware, getFollowingThreads);
router.get("/:id", authMiddleware, getThreadDetail);
router.get("/:id/replies", authMiddleware, getThreadReplies);
router.post("/", authMiddleware, upload.single("image"), createThread);
router.post("/:id/like", authMiddleware, toggleLike);

export default router;
