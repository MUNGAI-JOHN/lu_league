import { Request, Response } from "express";
import * as matchService from "./match.service.ts";
import { AuthRequest } from "../auth/auth.middleware.ts";

// 🎯 Create Match — Referee or Admin only
// 🎯 Create Match — Referee or Admin only
export const addMatch = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    // ✅ Only referee or admin can create a match
    if (//user.role !== "referee" &&  this is to allow only admin to create matches
    user.role !== "admin") {
      return res.status(403).json({ error: "Access denied —/Admin only" });
    }

    const { home_team_id, away_team_id, referee_id, match_date, venue, weather_conditions } = req.body;

    // ✅ Validation: ensure required fields are provided
    if (!home_team_id || !away_team_id || !referee_id || !match_date) {
      return res.status(400).json({ error: "Missing required match details" });
    }

    // ✅ Insert into DB
    const match = await matchService.createMatch({
      home_team_id,
      away_team_id,
      referee_id,
      match_date: new Date(match_date), // ensure proper timestamp format
      venue,
      weather_conditions,
    });

    res.status(201).json({ message: "Match created successfully", match });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



// 📋 Get All Matches
export const getMatches = async (req: Request, res: Response) => {
  try {
    const data = await matchService.getAllMatches();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get Match by ID
export const getMatch = async (req: Request, res: Response) => {
  try {
    const match = await matchService.getMatchById(Number(req.params.id));
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Match — Referee/Admin only
export const editMatch = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — Admin only" });
    }

    const updated = await matchService.updateMatch(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Match not found" });
    res.json({ message: "Match updated successfully", updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete Match — Admin only
export const removeMatch = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — Admin only" });
    }

    const deleted = await matchService.deleteMatch(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Match not found" });
    res.json({ message: "Match deleted successfully", deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
