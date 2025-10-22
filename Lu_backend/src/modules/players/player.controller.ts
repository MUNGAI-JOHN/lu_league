import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware.ts";
import * as playerService from "./player.service.ts";
import { db } from "../../config/db.ts";
import { teams, players } from "../../drizzle/schema.ts";
import { eq, inArray } from "drizzle-orm";

// ➕ Register player (Phase 2)
export const addPlayer = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { team_id, join_code } = req.body;

    const playerData = {
      ...req.body,
      user_id: user.id,
      status: "pending" as const,
    };

    const player = await playerService.createPlayer(playerData);

    // Optional auto-approval if join_code matches
    if (join_code) {
      const approved = await playerService.autoApproveByJoinCode(join_code, user.id);
      if (approved) {
        return res.status(201).json({
          message: "Player auto-approved via join code",
          player: approved,
        });
      }
    }

    res.status(201).json({
      message: "Player registered successfully, awaiting coach approval",
      player,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// 📋 Get all players
export const getPlayers = async (req: AuthRequest, res: Response) => {
  try {
    const players = await playerService.getAllPlayers();
    res.json(players);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Get player by ID
export const getPlayer = async (req: AuthRequest, res: Response) => {
  try {
    const playerId = Number(req.params.id);
    if (isNaN(playerId)) return res.status(400).json({ error: "Invalid player ID" });

    const player = await playerService.getPlayerById(playerId);
    if (!player) return res.status(404).json({ error: "Player not found" });

    res.json(player);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update player
export const editPlayer = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const playerId = Number(req.params.id);
    if (isNaN(playerId)) return res.status(400).json({ error: "Invalid player ID" });

    const existing = await playerService.getPlayerById(playerId);
    if (!existing) return res.status(404).json({ error: "Player not found" });

    // Only the same player, a coach, or admin can update
    if (user.role !== "admin" && user.role !== "coach" && existing.user_id !== user.id)
      return res.status(403).json({ error: "Not authorized" });

    const updated = await playerService.updatePlayer(playerId, req.body);
    res.json({ message: "Player updated", updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Delete player
export const removePlayer = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "admin" && user.role !== "coach")
      return res.status(403).json({ error: "Access denied" });

    const playerId = Number(req.params.id);
    if (isNaN(playerId)) return res.status(400).json({ error: "Invalid player ID" });

    const deleted = await playerService.deletePlayer(playerId);
    res.json({ message: "Player deleted", deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Approve player manually (only by coach of that team)
export const approvePendingPlayer = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "coach") {
      return res.status(403).json({ error: "Only coaches can approve players" });
    }

    const playerId = Number(req.params.id);
    const { team_id } = req.body;

    if (!playerId || !team_id || isNaN(playerId) || isNaN(Number(team_id))) {
      return res.status(400).json({ error: "Valid playerId and team_id are required" });
    }

    // Confirm this team belongs to logged-in coach
    const [team] = await db.select().from(teams).where(eq(teams.id, Number(team_id)));
    if (!team) return res.status(404).json({ error: "Team not found" });
    if (team.coach_id !== user.id)
      return res.status(403).json({ error: "You can only approve players for your own team" });

    const approved = await playerService.approvePlayer(playerId, Number(team_id), user.id);
    res.json({ message: "Player approved successfully", approved });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Reject player manually (only by coach)
export const rejectPendingPlayer = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "coach")
      return res.status(403).json({ error: "Only coaches can reject players" });

    const playerId = Number(req.params.id);
    if (isNaN(playerId)) return res.status(400).json({ error: "Invalid player ID" });

    const rejected = await playerService.rejectPlayer(playerId);
    res.json({ message: "Player rejected", rejected });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🕒 Get pending players for this coach
export const getPendingPlayers = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "coach")
      return res.status(403).json({ error: "Access denied" });

    // Get teams owned by this coach
    const teamsOwned = await db.select().from(teams).where(eq(teams.coach_id, user.id));
    if (teamsOwned.length === 0)
      return res.json({ message: "You have no teams" });

    const teamIds = teamsOwned.map((t) => t.id);

    const allPendingPlayers = await db
      .select()
      .from(players)
      .where(eq(players.team_approval, "pending"));

    const filtered = allPendingPlayers.filter((p) =>
      p.team_id && teamIds.includes(p.team_id)
    );

    res.json({ count: filtered.length, pending: filtered });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
