import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getFollowList,
  followUser,
  unfollowUser,
} from "../controllers/follow.controller";

const router = Router();

router.get("/", authMiddleware, getFollowList);
router.post("/", authMiddleware, followUser);
router.delete("/", authMiddleware, unfollowUser);

export default router;
