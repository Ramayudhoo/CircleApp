import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getReplies,
  CreateReplies,
  toggleReplyLike,
} from "../controllers/thread.controller";
import upload from "../lib/multer";

const router = Router();

// router.get("/", authMiddleware, getReplies);
router.post("/", authMiddleware, upload.single("image"), CreateReplies);
router.post("/:id/like", authMiddleware, toggleReplyLike);

export default router;
