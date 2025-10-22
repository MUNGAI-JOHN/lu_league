import express from "express";
import {
  registerCoachPhase2,
  getCoaches,
  getCoach,
  editCoach,
  removeCoach,
} from "./coach.controller.ts";
import { authenticateJWT } from "../auth/auth.middleware.ts";

const router = express.Router();

// Phase 2 registration (coach fills personal info)
router.post("/register-phase2", authenticateJWT, registerCoachPhase2);

// CRUD routes
router.get("/", getCoaches);
router.get("/:id", getCoach);
router.put("/:id", authenticateJWT, editCoach);
router.delete("/:id", authenticateJWT, removeCoach);

export default router;
