import { db } from "../../config/db.ts";
import { results, matches, teams, players, users } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { updateTeamStatsAfterMatch } from "../standings/standings.service.ts";

// ✅ Create result (by referee, coach, or admin)
export const createResult = async (data: any) => {
  const [newResult] = await db
    .insert(results)
    .values({
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning();

  return newResult;
};

// ✅ Get all results (joined with matches, teams, player + user for MOTM)
export const getAllResultsWithDetails = async () => {
  const awayTeams = alias(teams, "away_teams");

  const allResults = await db
    .select({
      id: results.id,
      home_team_score: results.home_team_score,
      away_team_score: results.away_team_score,
      half_time_score: results.half_time_score,
      approved: results.approved,
      match_date: matches.match_date,
      venue: matches.venue,
      home_team: teams.name,
      away_team: awayTeams.name,
      man_of_the_match: users.name,
    })
    .from(results)
    .leftJoin(matches, eq(results.match_id, matches.id))
    .leftJoin(teams, eq(matches.home_team_id, teams.id))
    .leftJoin(awayTeams, eq(matches.away_team_id, awayTeams.id))
    .leftJoin(players, eq(results.man_of_the_match, players.id))
    .leftJoin(users, eq(players.user_id, users.id));

  return allResults;
};

// ✅ Get single result by ID (with all joins)
export const getResultById = async (id: number) => {
  const homeTeams = alias(teams, "home_team");
  const awayTeams = alias(teams, "away_team");
  const motmPlayer = alias(players, "motm_player");
  const motmUser = alias(users, "motm_user");

  const [result] = await db
    .select({
      result_id: results.id,
      match_id: matches.id,
      home_team_score: results.home_team_score,
      away_team_score: results.away_team_score,
      half_time_score: results.half_time_score,
      approved: results.approved,
      match_date: matches.match_date,
      venue: matches.venue,
      status: matches.status,
      home_team_name: homeTeams.name,
      away_team_name: awayTeams.name,
      man_of_the_match: motmUser.name,
    })
    .from(results)
    .innerJoin(matches, eq(results.match_id, matches.id))
    .innerJoin(homeTeams, eq(matches.home_team_id, homeTeams.id))
    .innerJoin(awayTeams, eq(matches.away_team_id, awayTeams.id))
    .leftJoin(motmPlayer, eq(results.man_of_the_match, motmPlayer.id))
    .leftJoin(motmUser, eq(motmPlayer.user_id, motmUser.id))
    .where(eq(results.id, id));

  return result;
};

// ✅ Update result (by referee or admin)
export const updateResult = async (id: number, data: any) => {
  const [updated] = await db
    .update(results)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(results.id, id))
    .returning();

  return updated;
};


// ✅ Approve result (Admin only) + auto-update standings
export const approveResult = async (id: number) => {
  const [match] = await db.select().from(results).where(eq(results.id, id));

  if (!match) {
    throw new Error("Result not found");
  }

  if (match.approved) {
    return { message: "Result already approved" };
  }

  // Mark approved
  const [approved] = await db
    .update(results)
    .set({ approved: true, updated_at: new Date() })
    .where(eq(results.id, id))
    .returning();

  // Fetch match teams to update standings
  const [linkedMatch] = await db
    .select({
      home_team_id: matches.home_team_id,
      away_team_id: matches.away_team_id,
    })
    .from(matches)
    .where(eq(matches.id, match.match_id));

  // ✅ Ensure all IDs and scores exist before calling standings update
  if (
    linkedMatch?.home_team_id != null &&
    linkedMatch?.away_team_id != null &&
    match.home_team_score != null &&
    match.away_team_score != null
  ) {
    await updateTeamStatsAfterMatch(
      linkedMatch.home_team_id,
      linkedMatch.away_team_id,
      match.home_team_score,
      match.away_team_score
    );
  } else {
    console.warn("⚠️ Missing data to update standings — skipped standings update");
  }

  return { message: "Result approved and standings updated successfully", approved };
};


// ✅ Delete result (Admin only)
export const deleteResult = async (id: number) => {
  const [deleted] = await db.delete(results).where(eq(results.id, id)).returning();
  return deleted;
};
