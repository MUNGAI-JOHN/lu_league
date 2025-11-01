// src/modules/team/team.routes.ts
import express from "express";
import { authenticateJWT } from "../auth/auth.middleware.ts";
import {
  addTeam,
  approveTeam,
  editTeam,
  getCoachTeams,
  getPendingTeamsController,
  getTeam,
  getTeams,
  removeTeam,
} from "./team.controller.ts";

const router = express.Router();

router.post("/create-team", authenticateJWT, addTeam); // Coach/Admin create
router.get("/all", getTeams); // Get all teams
router.get("/coach/:coachId", authenticateJWT, getCoachTeams); // Get team by coach_id
router.get("/:id", getTeam); // Get one team
router.patch("/:id", authenticateJWT, editTeam); // Update
router.delete("/:id", authenticateJWT, removeTeam); // Delete
router.put("/:id/approve", authenticateJWT, approveTeam); // Admin approves
router.get("/pending/all", authenticateJWT, getPendingTeamsController); // Admin pending list

export default router;
