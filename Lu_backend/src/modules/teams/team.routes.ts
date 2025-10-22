// src/modules/team/team.routes.ts
import express from "express";
import {
  addTeam,
  getTeams,
  getTeam,
  editTeam,
  removeTeam,
  approveTeam,
  getPendingTeamsController,
} from "./team.controller.ts";
import { authenticateJWT } from "../auth/auth.middleware.ts";

const router = express.Router();

router.post("/create", authenticateJWT, addTeam);               // Coach/Admin create
router.get("/", getTeams);                                     // Get all teams
router.get("/:id", getTeam);                                   // Get one team
router.put("/:id", authenticateJWT, editTeam);                 // Update
router.delete("/:id", authenticateJWT, removeTeam);            // Delete
router.put("/:id/approve", authenticateJWT, approveTeam);      // Admin approves
router.get("/pending/all", authenticateJWT, getPendingTeamsController); // Admin pending list

export default router;
