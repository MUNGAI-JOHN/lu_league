// src/modules/team/team.service.ts
import { db } from "../../config/db.ts";
import { teams } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

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
  const [updated] = await db
    .update(teams)
    .set(teamData)
    .where(eq(teams.id, id))
    .returning();
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
