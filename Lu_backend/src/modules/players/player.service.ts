import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../../config/db.ts";
import { coaches, players, teams, users } from "../../drizzle/schema.ts"; // ✅ add users

const coachUser = alias(users, "coach_user"); // 👈 create alias for the coach's user

// ➕ Create player (Phase 2 registration)
export const createPlayer = async (playerData: any) => {
  // 1️⃣ Check if player already exists (prevent duplicate phase 2)
  const existing = await db.query.players.findFirst({
    where: (p, { eq }) => eq(p.user_id, playerData.user_id),
  });

  if (existing) {
    throw new Error("Phase 2 registration already completed.");
  }

  // 2️⃣ Insert player data
  const [newPlayer] = await db.insert(players).values(playerData).returning();

  // 3️⃣ Mark user as having completed phase 2
  await db.update(users).set({ phase2_completed: true }).where(eq(users.id, playerData.user_id));

  return newPlayer;
};

// ✅ Create alias for users table (coach)
const coachAlias = users as typeof users & { tableName: "coach" };
// 📋 Get all players
export const getAllPlayers = async () => {
  try {
    const allPlayers = await db
      .select({
        // --- player info ---
        id: players.id,
        user_id: players.user_id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        date_of_birth: players.date_of_birth,
        gender: players.gender,
        nationality: players.nationality,
        phone: players.phone,
        address: players.address,
        age: players.age,
        position: players.position,
        isSubstitute: players.isSubstitute,
        jersey_number: players.jersey_number,
        join_code: players.join_code,
        team_approval: players.team_approval,
        height: players.height,
        weight: players.weight,
        preferred_foot: players.preferred_foot,
        injury_status: players.injury_status,
        fitness_level: players.fitness_level,
        profile_image: players.profile_image,
        team_name: teams.name,
        coach_name: coachAlias.name,
      })
      .from(players)

      .leftJoin(users, eq(players.user_id, users.id))
      .leftJoin(coaches, eq(players.coach_id, coaches.id))
      .leftJoin(teams, eq(players.team_id, teams.id))
      .leftJoin(coachUser, eq(coaches.user_id, coachUser.id)); // ✅ alias used here

    return allPlayers;
  } catch (err) {
    console.error("Error in getAllplayers:", err);
    throw err; // rethrow to be caught by controller
  }
};

// 🟢 GET PLAYERS BY COACH ID
export const getPlayersByCoach = async (coachId: number) => {
  try {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        player_id: players.id,
        date_of_birth: players.date_of_birth,
        gender: players.gender,
        nationality: players.nationality,
        phone: players.phone,
        address: players.address,
        age: players.age,
        position: players.position,
        isSubstitute: players.isSubstitute,
        jersey_number: players.jersey_number,
        join_code: players.join_code,
        team_approval: players.team_approval,
        height: players.height,
        weight: players.weight,
        preferred_foot: players.preferred_foot,
        injury_status: players.injury_status,
        fitness_level: players.fitness_level,
        profile_image: players.profile_image,
        team_id: teams.id,
        team_name: teams.name,
        coach_name: coachAlias.name,
      })
      .from(players)
      // join player → user (to get player full name)
      .leftJoin(users, eq(players.user_id, users.id))
      // join player → coach (to know which coach they belong to)
      .leftJoin(coaches, eq(players.coach_id, coaches.id))
      // join player → team (to get team info)
      .leftJoin(teams, eq(players.team_id, teams.id))
      .where(eq(players.coach_id, coachId));
    return result;
  } catch (err) {
    console.error("Error in getAllplayers:", err);
    throw err; // rethrow to be caught by controller
  }
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

// this helps a player dashboard to have its own data

export const getAPlayer = async (user_id: number) => {
  try {
    const player = await db
      .select({
        id: players.id,
      })
      .from(players)
      .where(eq(players.user_id, user_id));

    return player;
  } catch (err) {
    console.error("Error in getAplayer:", err);
    throw err; // rethrow to be caught by controller
  }
};

// 🔍 Get player by ID
export const getPlayerById = async (id: number) => {
  const [player] = await db
    .select({
      id: users.id,
      user_id: players.user_id,
      name: users.name,
      email: users.email,
      player_id: players.id,
      date_of_birth: players.date_of_birth,
      gender: players.gender,
      nationality: players.nationality,
      phone: players.phone,
      address: players.address,
      age: players.age,
      position: players.position,
      isSubstitute: players.isSubstitute,
      jersey_number: players.jersey_number,
      join_code: players.join_code,
      team_approval: players.team_approval,
      height: players.height,
      weight: players.weight,
      preferred_foot: players.preferred_foot,
      injury_status: players.injury_status,
      fitness_level: players.fitness_level,
      profile_image: players.profile_image,
      team_id: teams.id,
      team_name: teams.name,
      coach_name: coachAlias.name,
    })
    .from(players)
    .leftJoin(users, eq(players.user_id, users.id))
    .leftJoin(teams, eq(players.team_id, teams.id))
    .leftJoin(coaches, eq(players.coach_id, coaches.id))
    .where(eq(players.id, id));
  return player;
};

// ✏️ Update player
export const updatePlayer = async (id: number, data: any) => {
  const [updated] = await db.update(players).set(data).where(eq(players.id, id)).returning();
  return updated;
};

// ❌ Delete player
export const deletePlayer = async (id: number) => {
  const [deleted] = await db.delete(players).where(eq(players.id, id)).returning();
  return deleted;
};

// 🕒 Get pending players
export const getPendingPlayers = async () => {
  return db.select().from(players).where(eq(players.team_approval, "pending"));
};

// ✅ Approve player (coach only)
export const approvePlayer = async (id: number) => {
  // console.log(id, team_id, coach_id);
  const [approved] = await db
    .update(players)
    .set({ team_approval: "approved" })
    .where(eq(players.id, id))
    .returning();
  console.log(approved);
  return approved;
};

// ❌ Reject player
export const rejectPlayer = async (id: number) => {
  const [rejected] = await db
    .update(players)
    .set({ team_approval: "rejected" })
    .where(eq(players.id, id))
    .returning();
  return rejected;
};

// ✅ Auto-approve via join code during registration
export const autoApproveByJoinCode = async (join_code: string, user_id: number) => {
  // 1️⃣ Find the team with the join_code
  const [team] = await db.select().from(teams).where(eq(teams.join_code, join_code));
  if (!team) return null;

  // 2️⃣ Update player with team_id and coach_id
  const [approved] = await db
    .update(players)
    .set({
      team_approval: "approved",
      team_id: team.id,
      coach_id: team.coach_id,
    })
    .where(eq(players.user_id, user_id))
    .returning();

  return approved;
};
