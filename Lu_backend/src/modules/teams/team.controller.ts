// src/modules/team/team.controller.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../../config/db.ts";
import { coaches } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  getPendingTeams,
} from "./team.service.ts";
import { nanoid } from "nanoid";

// 🟢 CREATE TEAM (Admin or Coach)
export const addTeam = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ error: "Authorization header missing or invalid" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    if (decoded.role !== "coach" && decoded.role !== "admin")
      return res.status(403).json({ error: "Only coaches or admins can create teams" });

    let coach_id: number;
    let created_by_admin = false;

    if (decoded.role === "coach") {
      const [coach] = await db.select().from(coaches).where(eq(coaches.user_id, decoded.id));
      if (!coach) return res.status(404).json({ error: "Coach profile not found" });
      coach_id = coach.id;
    } else {
      if (!req.body.coach_id)
        return res.status(400).json({ error: "Admin must specify a coach_id" });
      coach_id = req.body.coach_id;
      created_by_admin = true;
    }

    const teamData = {
      ...req.body,
      coach_id,
      join_code: nanoid(6).toUpperCase(),
      created_by_admin,
      approval_status: created_by_admin ? "approved" : "pending",
    };

    const team = await createTeam(teamData);
    res.status(201).json({ message: "Team created successfully", team });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🔵 GET ALL TEAMS
export const getTeams = async (_req: Request, res: Response) => {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🟣 GET TEAM BY ID
export const getTeam = async (req: Request, res: Response) => {
  try {
    const team = await getTeamById(Number(req.params.id));
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🟠 UPDATE TEAM (Coach/Admin)
export const editTeam = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ error: "Authorization header missing or invalid" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    if (decoded.role !== "coach" && decoded.role !== "admin")
      return res.status(403).json({ error: "Only coaches or admins can update teams" });

    const updated = await updateTeam(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Team not found" });

    res.json({ message: "Team updated successfully", updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🔴 DELETE TEAM (Coach/Admin)
export const removeTeam = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ error: "Authorization header missing or invalid" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    if (decoded.role !== "coach" && decoded.role !== "admin")
      return res.status(403).json({ error: "Only coaches or admins can delete teams" });

    const deleted = await deleteTeam(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Team not found" });

    res.json({ message: "Team deleted successfully", deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🟩 APPROVE TEAM (Admin only)
export const approveTeam = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ error: "Authorization header missing or invalid" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Only admins can approve teams" });

    const teamId = Number(req.params.id);
    if (isNaN(teamId)) return res.status(400).json({ error: "Invalid team ID" });

    const team = await getTeamById(teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    const approvedTeam = await updateTeam(teamId, { approval_status: "approved" });
    res.json({ message: "Team approved successfully", team: approvedTeam });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🟡 GET ALL PENDING TEAMS (Admin only)
export const getPendingTeamsController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer "))
      return res.status(401).json({ error: "Authorization header missing or invalid" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
    };

    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Only admins can view pending teams" });

    const pendingTeams = await getPendingTeams();
    res.json({ count: pendingTeams.length, pendingTeams });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
