import { db } from "../../config/db.ts";
import { players, teams, users } from "../../drizzle/schema.ts"; // ✅ add users
import { eq } from "drizzle-orm";

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
  await db
    .update(users)
    .set({ phase2_completed: true })
    .where(eq(users.id, playerData.user_id));

  return newPlayer;
};

// 📋 Get all players
export const getAllPlayers = async () => db.select().from(players);

// 🔍 Get player by ID
export const getPlayerById = async (id: number) => {
  const [player] = await db.select().from(players).where(eq(players.id, id));
  return player;
};

// ✏️ Update player
export const updatePlayer = async (id: number, data: any) => {
  const [updated] = await db
    .update(players)
    .set(data)
    .where(eq(players.id, id))
    .returning();
  return updated;
};

// ❌ Delete player
export const deletePlayer = async (id: number) => {
  const [deleted] = await db
    .delete(players)
    .where(eq(players.id, id))
    .returning();
  return deleted;
};

// 🕒 Get pending players
export const getPendingPlayers = async () => {
  return db.select().from(players).where(eq(players.team_approval, "pending"));
};

// ✅ Approve player (coach only)
export const approvePlayer = async (
  id: number,
  team_id: number,
  coach_id: number
) => {
  if (!id || !team_id || !coach_id) throw new Error("Missing required approval fields");

  const [approved] = await db
    .update(players)
    .set({ team_approval: "approved", team_id, coach_id })
    .where(eq(players.id, id))
    .returning();
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
export const autoApproveByJoinCode = async (
  join_code: string,
  user_id: number
) => {
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
