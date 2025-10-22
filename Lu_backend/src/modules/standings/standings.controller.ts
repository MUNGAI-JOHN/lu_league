// src/modules/standings/standings.controller.ts
import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware.ts"; // Typed request
import { db } from "../../config/db.ts";
import { standings, teams, results, matches } from "../../drizzle/schema.ts";
import { desc, eq } from "drizzle-orm";
import { updateTeamStatsAfterMatch } from "./standings.service.ts";

/**
 * GET /standings
 * Fetch league table sorted by points, goal difference, then goals for
 */
export const getAllStandings = async (req: AuthRequest, res: Response) => {
  try {
    const data = await db
      .select({
        team_id: standings.team_id,
        team_name: teams.name,
        played: standings.played,
        wins: standings.wins,
        draws: standings.draws,
        losses: standings.losses,
        goals_for: standings.goals_for,
        goals_against: standings.goals_against,
        goal_difference: standings.goal_difference,
        points: standings.points,
      })
      .from(standings)
      .leftJoin(teams, eq(teams.id, standings.team_id))
      .orderBy(
        desc(standings.points),
        desc(standings.goal_difference),
        desc(standings.goals_for)
      );

    return res.json({ success: true, standings: data });
  } catch (error) {
    console.error("Error fetching standings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET /standings/:teamId
 * Fetch standing details for one team
 */
export const getTeamStanding = async (req: AuthRequest, res: Response) => {
  const { teamId } = req.params;
  try {
    const [data] = await db
      .select()
      .from(standings)
      .where(eq(standings.team_id, Number(teamId)));

    if (!data)
      return res.status(404).json({ success: false, message: "Team not found" });

    return res.json({ success: true, standing: data });
  } catch (error) {
    console.error("Error fetching team standing:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /standings/recalculate
 * (Admin only) Recalculate all standings from results table
 */
export const recalculateStandings = async (req: AuthRequest, res: Response) => {
  try {
    // ✅ Role check inside controller
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied — Admin only" });
    }

    // 1️⃣ Clear existing standings
    await db.delete(standings);

    // 2️⃣ Fetch results joined with matches to get team IDs
    const allResults = await db
      .select({
        id: results.id,
        approved: results.approved,
        home_team_score: results.home_team_score,
        away_team_score: results.away_team_score,
        home_team_id: matches.home_team_id,
        away_team_id: matches.away_team_id,
      })
      .from(results)
      .innerJoin(matches, eq(results.match_id, matches.id));

    // 3️⃣ Recalculate standings for each approved match
    for (const match of allResults) {
      if (match.approved) {
        await updateTeamStatsAfterMatch(
          match.home_team_id!,
          match.away_team_id!,
          match.home_team_score!,
          match.away_team_score!
        );
      }
    }

    res.json({ success: true, message: "Standings recalculated successfully" });
  } catch (error) {
    console.error("Error recalculating standings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
