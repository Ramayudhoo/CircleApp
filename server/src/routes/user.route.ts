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

router.get("/suggestions", authMiddleware, getSuggestedUsers);

router.get("/search", authMiddleware, searchUser);

// 1. Route untuk current user (SPESIFIK)
router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, upload.single("image"), updateProfile);

// 2. Route dengan parameter dinamis (SETELAH route spesifik)
router.get("/:id/threads", authMiddleware, getUserThreads);
router.get("/:id", authMiddleware, getUserProfile); // ← ini harus paling bawah

export default router;
