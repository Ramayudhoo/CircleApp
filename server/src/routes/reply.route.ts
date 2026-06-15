import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getReplies,
  CreateReplies,
  toggleReplyLike,
} from "../controllers/thread.controller";
import upload from "../lib/multer";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Replies
 *   description: API for managing thread replies
 */

/**
 * @swagger
 * /reply:
 *   post:
 *     summary: Create a reply to a thread
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - threadId
 *             properties:
 *               content:
 *                 type: string
 *                 example: My reply on this thread.
 *               threadId:
 *                 type: string
 *                 example: thread-uuid-here
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Reply created successfully
 */
router.post("/", authMiddleware, upload.single("image"), CreateReplies);

/**
 * @swagger
 * /reply/{id}/like:
 *   post:
 *     summary: Toggle like status on a reply
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The reply ID
 *     responses:
 *       200:
 *         description: Reply like status toggled successfully
 */
router.post("/:id/like", authMiddleware, toggleReplyLike);

export default router;
