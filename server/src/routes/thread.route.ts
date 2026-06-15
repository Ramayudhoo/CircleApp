import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
   createThread,
   getThreads,
   toggleLike,
   getThreadDetail,
   getThreadReplies,
 } from "../controllers/thread.controller";
 import upload from "../lib/multer";
 
 const router = Router();
 
 /**
  * @swagger
  * tags:
  *   name: Threads
  *   description: API for managing Threads
  */
 
 /**
  * @swagger
  * /threads:
  *   get:
  *     summary: Get all threads
  *     tags: [Threads]
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: List of threads retrieved successfully
  *       401:
  *         description: Unauthorized
  */
 router.get("/", authMiddleware, getThreads);
 
 /**
  * @swagger
  * /threads/{id}:
  *   get:
  *     summary: Get detailed thread by ID
  *     tags: [Threads]
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The thread ID
  *     responses:
  *       200:
  *         description: Thread detail retrieved successfully
  *       404:
  *         description: Thread not found
  */
 router.get("/:id", authMiddleware, getThreadDetail);
 
 /**
  * @swagger
  * /threads/{id}/replies:
  *   get:
  *     summary: Get all replies for a thread
  *     tags: [Threads]
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The thread ID
  *     responses:
  *       200:
  *         description: Thread replies retrieved successfully
  */
 router.get("/:id/replies", authMiddleware, getThreadReplies);
 
 /**
  * @swagger
  * /threads:
  *   post:
  *     summary: Create a new thread
  *     tags: [Threads]
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             properties:
  *               content:
  *                 type: string
  *                 example: This is a new thread content!
  *               image:
  *                 type: string
  *                 format: binary
  *     responses:
  *       201:
  *         description: Thread created successfully
  */
 router.post("/", authMiddleware, upload.single("image"), createThread);
 
 /**
  * @swagger
  * /threads/{id}/like:
  *   post:
  *     summary: Toggle like on a thread
  *     tags: [Threads]
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *         description: The thread ID
  *     responses:
  *       200:
  *         description: Thread like status toggled successfully
  */
 router.post("/:id/like", authMiddleware, toggleLike);
 
 export default router;
