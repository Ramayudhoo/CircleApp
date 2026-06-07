import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getReplies } from "../controllers/thread.controller";

const router = Router();

router.get("/", authMiddleware, getReplies);

export default router;
