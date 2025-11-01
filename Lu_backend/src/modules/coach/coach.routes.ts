import express from "express";
import { authenticateJWT } from "../auth/auth.middleware.ts";
import {
  editCoach,
  getCoachContoller,
  getCoaches,
  registerCoachPhase2,
  removeCoach,
} from "./coach.controller.ts";

const router = express.Router();

// Phase 2 registration (coach fills personal info)
router.post("/register-phase2", authenticateJWT, registerCoachPhase2);

// CRUD routes
router.get("/all", getCoaches);
router.get("/:id", authenticateJWT, getCoachContoller);
router.patch("/:id", authenticateJWT, editCoach);
router.delete("/:id", authenticateJWT, removeCoach);

export default router;
