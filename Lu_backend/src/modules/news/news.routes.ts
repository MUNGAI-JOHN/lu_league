import { Router } from "express";
import { authenticateJWT } from "../auth/auth.middleware.ts";
import {
  approveNews,
  createNews,
  deleteNews,
  getAllApprovedNew,
  getAllNews,
  getNewsById,
  getPendingNews,
  rejectNews,
  updateNews,
} from "./news.controller.ts";

const router = Router();

/**
 * 🟩 News Routes
 * Accessible by different roles based on permission level.
 */

// 👇 Create — Player, Coach, Referee, Admin
router.post("/create-news", authenticateJWT, createNews);

router.get("/all", getAllNews);
// 📜 Get all approved news (public)
router.get("/approved", getAllApprovedNew);
// 📘 Get single news (anyone)
router.get("/:id", getNewsById);

// 📜 Get all approved news (public)
router.get("/approved", getAllApprovedNew);

// 🕓 Get all pending news (Admin)
router.get("/admin/pending", authenticateJWT, getPendingNews);

// ✏️ Update — Author (before approval) or Admin
router.put("/:id", authenticateJWT, updateNews);

// ✅ Approve — Admin only
router.put("/:id/approve", authenticateJWT, approveNews);

// ❌ Reject — Admin only
router.put("/:id/reject", authenticateJWT, rejectNews);

// 🗑️ Delete — Admin only
router.delete("/:id", authenticateJWT, deleteNews);

export default router;
