import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getProfile, // GET /user/profile (current user)
  getUserThreads, // GET /user/:id/threads
  updateProfile, // PATCH /user/profile
  getUserProfile,
  searchUser,
  getSuggestedUsers, // GET /user/:id (user lain)
} from "../controllers/user.controller";
import upload from "../lib/multer";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing User profiles and searches
 */

/**
 * @swagger
 * /user/suggestions:
 *   get:
 *     summary: Get user suggestions to follow
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of suggested users
 */
router.get("/suggestions", authMiddleware, getSuggestedUsers);

/**
 * @swagger
 * /user/search:
 *   get:
 *     summary: Search for users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query for username or fullname
 *     responses:
 *       200:
 *         description: List of matching users
 */
router.get("/search", authMiddleware, searchUser);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *   patch:
 *     summary: Update current authenticated user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Jane Doe
 *               bio:
 *                 type: string
 *                 example: software engineer & tech enthusiast.
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, upload.single("image"), updateProfile);

/**
 * @swagger
 * /user/{id}/threads:
 *   get:
 *     summary: Get threads created by a specific user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The User ID
 *     responses:
 *       200:
 *         description: List of user threads
 */
router.get("/:id/threads", authMiddleware, getUserThreads);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get profile of another user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The User ID
 *     responses:
 *       200:
 *         description: User profile details
 *       404:
 *         description: User not found
 */
router.get("/:id", authMiddleware, getUserProfile); // ← ini harus paling bawah

export default router;
