import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createThread,
  getThreads,
  toggleLike,
} from "../controllers/thread.controller";
import upload from "../lib/multer";

const router = Router();

router.get("/", authMiddleware, getThreads);
router.post("/:id/like", authMiddleware, toggleLike);
router.post("/", authMiddleware, upload.single("image"), createThread);
export default router;
