import express from "express";
import {
  addMatch,
  getMatches,
  getMatch,
  editMatch,
  removeMatch,
} from "./match.controller.ts";
import { authenticateJWT } from "../auth/auth.middleware.ts";

const router = express.Router();

// 🏟️ Public
router.get("/", getMatches);
router.get("/:id", getMatch);

// 🔒 Protected (Referee/Admin)
router.post("/create", authenticateJWT, addMatch);
router.put("/:id", authenticateJWT, editMatch);
router.delete("/:id", authenticateJWT, removeMatch);

export default router;
