import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getReplies, CreateReplies } from "../controllers/thread.controller";

const router = Router();

router.get("/", authMiddleware, getReplies);
router.post("/", authMiddleware, CreateReplies);

export default router;
