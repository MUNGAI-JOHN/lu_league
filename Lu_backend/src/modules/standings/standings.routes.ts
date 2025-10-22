import { Router } from "express";
import { authenticateJWT } from "../auth/auth.middleware.ts";
import { getAllStandings, getTeamStanding, recalculateStandings } from "./standings.controller.ts";

const router = Router();

// Public (any logged-in user can view standings)
router.get("/", authenticateJWT, getAllStandings);
router.get("/:teamId", authenticateJWT, getTeamStanding);

// Admin only check moved into controller
router.post("/recalculate", authenticateJWT, recalculateStandings);

export default router;
