import express from "express";
import {
  addPlayer,
  getPlayers,
  getPlayer,
  editPlayer,
  removePlayer,
  approvePendingPlayer,
  rejectPendingPlayer,
  getPendingPlayers,
} from "./player.controller.ts";
import { authenticateJWT } from "../auth/auth.middleware.ts";

const router = express.Router();

// Public registration (player)
router.post("/register-phase2", authenticateJWT, addPlayer);

// Coach-only routes
router.get("/pending", authenticateJWT, getPendingPlayers);
router.put("/:id/approve", authenticateJWT, approvePendingPlayer);
router.put("/:id/reject", authenticateJWT, rejectPendingPlayer);

// General protected routes
router.get("/", authenticateJWT, getPlayers);
router.get("/:id", authenticateJWT, getPlayer);
router.put("/:id", authenticateJWT, editPlayer);
router.delete("/:id", authenticateJWT, removePlayer);

export default router;
