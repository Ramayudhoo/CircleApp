import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createThread,
  getThreads,
  toggleLike,
  getThreadDetail,
} from "../controllers/thread.controller";
import upload from "../lib/multer";

const router = Router();

router.get("/", authMiddleware, getThreads);
router.get("/:id", authMiddleware, getThreadDetail);
router.post("/", authMiddleware, upload.single("image"), createThread);
router.post("/:id/like", authMiddleware, toggleLike);

export default router;
