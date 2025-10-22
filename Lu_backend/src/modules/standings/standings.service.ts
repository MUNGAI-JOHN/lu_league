// src/modules/standings/standings.service.ts
import { db } from "../../config/db.ts";
import { standings, teams } from "../../drizzle/schema.ts";
import { eq, desc } from "drizzle-orm";

// 🟩 Ensure team stats exist
export const ensureTeamStatsExist = async (team_id: number) => {
  const [existing] = await db
    .select()
    .from(standings)
    .where(eq(standings.team_id, team_id));

  if (!existing) {
    await db.insert(standings).values({
      team_id,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goals_for: 0,
      goals_against: 0,
      goal_difference: 0,
      points: 0,
      updated_at: new Date(),
    });
  }
};

// 🟨 Update stats for a single team
const updateSingleTeamStats = async (
  teamId: number,
  goalsFor: number,
  goalsAgainst: number
) => {
  const [team] = await db
    .select()
    .from(standings)
    .where(eq(standings.team_id, teamId));

  if (!team) {
    await ensureTeamStatsExist(teamId);
    return updateSingleTeamStats(teamId, goalsFor, goalsAgainst);
  }

  let played = (team.played ?? 0) + 1;
  let goals_for = (team.goals_for ?? 0) + goalsFor;
  let goals_against = (team.goals_against ?? 0) + goalsAgainst;
  let goal_difference = goals_for - goals_against;

  let wins = team.wins ?? 0;
  let draws = team.draws ?? 0;
  let losses = team.losses ?? 0;
  let points = team.points ?? 0;

  if (goalsFor > goalsAgainst) {
    wins += 1;
    points += 3;
  } else if (goalsFor === goalsAgainst) {
    draws += 1;
    points += 1;
  } else {
    losses += 1;
  }

  await db
    .update(standings)
    .set({
      played,
      wins,
      draws,
      losses,
      goals_for,
      goals_against,
      goal_difference,
      points,
      updated_at: new Date(),
    })
    .where(eq(standings.team_id, teamId));
};

// 🟨 Update stats for both teams after a match
export const updateTeamStatsAfterMatch = async (
  homeTeamId: number,
  awayTeamId: number,
  homeGoals: number,
  awayGoals: number
) => {
  await ensureTeamStatsExist(homeTeamId);
  await ensureTeamStatsExist(awayTeamId);

  await updateSingleTeamStats(homeTeamId, homeGoals, awayGoals);
  await updateSingleTeamStats(awayTeamId, awayGoals, homeGoals);
};

// 📊 Get league table sorted by points -> goal difference -> goals for
export const getLeagueStandings = async () => {
  return db
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
};

// 🔄 Reset all standings (Admin utility)
export const resetAllStats = async () => {
  await db.delete(standings);
  return { message: "All team stats reset successfully" };
};
