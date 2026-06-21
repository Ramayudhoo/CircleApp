import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getFollowList,
  followUser,
  unfollowUser,
} from "../controllers/follow.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Follows
 *   description: API for managing user follows/followers relationship
 */

/**
 * @swagger
 * /follows:
 *   get:
 *     summary: Get follow list (following and followers)
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of followers and followings retrieved successfully
 */
router.get("/", authMiddleware, getFollowList);

/**
 * @swagger
 * /follows:
 *   post:
 *     summary: Follow a user
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followingId
 *             properties:
 *               followingId:
 *                 type: string
 *                 example: target-user-id-here
 *     responses:
 *       200:
 *         description: Successfully followed user
 */
router.post("/", authMiddleware, followUser);

/**
 * @swagger
 * /follows:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - followingId
 *             properties:
 *               followingId:
 *                 type: string
 *                 example: target-user-id-here
 *     responses:
 *       200:
 *         description: Successfully unfollowed user
 */
router.delete("/", authMiddleware, unfollowUser);

export default router;
