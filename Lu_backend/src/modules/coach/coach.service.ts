import { db } from "../../config/db.ts";
import { coaches, users } from "../../drizzle/schema.ts"; // ✅ add users table
import { eq } from "drizzle-orm";

export const createCoach = async (coachData: {
  user_id: number;
  date_of_birth: string;
  gender?: string;
  nationality?: string;
  email: string;
  phone_number?: string;
  address?: string;
  specialization?: string;
  experience_years?: number;
  certifications?: string;
  joining_date?: string;
  contract_end_date?: string;
  salary?: number;
  status?: string;
  profile_image?: string;
}) => {
  // 1️⃣ Check if coach already exists (prevent duplicate phase 2)
  const existing = await db.query.coaches.findFirst({
    where: (c, { eq }) => eq(c.user_id, coachData.user_id),
  });

  if (existing) {
    throw new Error("Phase 2 registration already completed.");
  }

  // 2️⃣ Create new coach record
  const [newCoach] = await db.insert(coaches).values(coachData).returning();

  // 3️⃣ Mark user as having completed phase 2
  await db
    .update(users)
    .set({ phase2_completed: true })
    .where(eq(users.id, coachData.user_id));

  return newCoach;
};


export const getAllCoaches = async () => {
  return await db.select().from(coaches);
};

export const getCoachById = async (id: number) => {
  const [coach] = await db.select().from(coaches).where(eq(coaches.id, id));
  return coach;
};

export const updateCoach = async (id: number, data: any) => {
  const [updated] = await db
    .update(coaches)
    .set(data)
    .where(eq(coaches.id, id))
    .returning();
  return updated;
};

export const deleteCoach = async (id: number) => {
  const [deleted] = await db.delete(coaches).where(eq(coaches.id, id)).returning();
  return deleted;
};
