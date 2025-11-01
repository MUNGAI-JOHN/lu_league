import express from "express";
import { authenticateJWT } from "../auth/auth.middleware.ts";
import {
  addPlayer,
  approvePendingPlayer,
  editPlayer,
  getCoachPlayers,
  getPendingPlayers,
  getplayerContoller,
  getPlayers,
  rejectPendingPlayer,
  removePlayer,
} from "./player.controller.ts";

const router = express.Router();

// Public registration (player)
router.post("/register-phase2", authenticateJWT, addPlayer);

// Coach-only routes
router.get("/coach/:coachId", authenticateJWT, getCoachPlayers); // Get team by coach_id
router.get("/pending", authenticateJWT, getPendingPlayers);
router.put("/:id/approve", authenticateJWT, approvePendingPlayer);
router.put("/:id/reject", authenticateJWT, rejectPendingPlayer);

// General protected routes
router.get("/all", authenticateJWT, getPlayers);
router.get("/:id", authenticateJWT, getplayerContoller);
router.patch("/:id", authenticateJWT, editPlayer);
router.delete("/:id", authenticateJWT, removePlayer);

export default router;
