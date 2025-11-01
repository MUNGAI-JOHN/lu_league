// src/modules/team/team.service.ts
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../../config/db.ts";
import { coaches, teams } from "../../drizzle/schema.ts";

// 🟢 CREATE TEAM
export const createTeam = async (teamData: any) => {
  // Default status
  if (!teamData.approval_status) {
    teamData.approval_status = teamData.created_by_admin ? "approved" : "pending";
  }

  // Auto-generate join code if not provided
  if (!teamData.join_code) {
    teamData.join_code = nanoid(6).toUpperCase(); // Example: "RW3F5A"
  }

  const [team] = await db.insert(teams).values(teamData).returning();
  return team;
};

// 🔵 GET ALL TEAMS
export const getAllTeams = async () => {
  return await db.select().from(teams);
};

// 🟣 GET TEAM BY ID
export const getTeamById = async (id: number) => {
  const [team] = await db.select().from(teams).where(eq(teams.id, id));
  return team;
};

// 🟠 UPDATE TEAM
export const updateTeam = async (id: number, teamData: any) => {
  const [updated] = await db.update(teams).set(teamData).where(eq(teams.id, id)).returning();
  return updated;
};

// 🔴 DELETE TEAM
export const deleteTeam = async (id: number) => {
  const [deleted] = await db.delete(teams).where(eq(teams.id, id)).returning();
  return deleted;
};

// 🟡 GET ALL PENDING TEAMS
export const getPendingTeams = async () => {
  return await db.select().from(teams).where(eq(teams.approval_status, "pending"));
};
// 🟢 GET TEAMS BY COACH ID
export const getTeamsByCoach = async (coachId: number) => {
  return await db.select().from(teams).where(eq(teams.coach_id, coachId));
};
export const getAllCoach = async (user_id: number) => {
  try {
    const allCoach = await db
      .select({
        id: coaches.id,
      })
      .from(coaches)
      .where(eq(coaches.user_id, user_id));

    return allCoach;
  } catch (err) {
    console.error("Error in getAllCoach:", err);
    throw err; // rethrow to be caught by controller
  }
};
