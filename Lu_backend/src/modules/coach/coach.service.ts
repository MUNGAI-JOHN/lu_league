import { eq } from "drizzle-orm";
import { db } from "../../config/db.ts";
import { coaches, users } from "../../drizzle/schema.ts"; // ✅ add users table

export const createCoach = async (coachData: {
  user_id: number;
  date_of_birth: string;
  gender?: string;
  nationality?: string;
  email: string;
  phone?: string;
  age?: number;
  address?: string;
  experience_years?: number;
  certifications?: string;
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
  await db.update(users).set({ phase2_completed: true }).where(eq(users.id, coachData.user_id));

  return newCoach;
};

// fetch all coaches with user info (merge fields if needed)

export const getAllCoaches = async () => {
  try {
    const allCoaches = await db
      .select({
        id: coaches.id,
        user_id: coaches.user_id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        date_of_birth: coaches.date_of_birth,
        gender: coaches.gender,
        nationality: coaches.nationality,
        phone: coaches.phone,
        address: coaches.address,
        age: coaches.age,
        experience_years: coaches.experience_years,
        certifications: coaches.certifications,
        profile_image: coaches.profile_image,
      })
      .from(coaches)
      .leftJoin(users, eq(coaches.user_id, users.id));

    return allCoaches;
  } catch (err) {
    console.error("Error in getAllCoaches:", err);
    throw err; // rethrow to be caught by controller
  }
};

export const getCoachById = async (id: number) => {
  const [coach] = await db
    .select({
      id: coaches.id,
      user_id: coaches.user_id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      date_of_birth: coaches.date_of_birth,
      gender: coaches.gender,
      nationality: coaches.nationality,
      phone: coaches.phone,
      address: coaches.address,
      age: coaches.age,
      experience_years: coaches.experience_years,
      certifications: coaches.certifications,
      profile_image: coaches.profile_image,
    })
    .from(coaches)
    .leftJoin(users, eq(coaches.user_id, users.id));

  return coach;
};
export const getCoachService = async (user_id: number) => {
  try {
    const Coach = await db
      .select({
        id: coaches.id,
      })
      .from(coaches)
      .where(eq(coaches.user_id, user_id));

    return Coach;
  } catch (err) {
    console.error("Error in getAllCoach:", err);
    throw err; // rethrow to be caught by controller
  }
};

export const updateCoach = async (id: number, data: any) => {
  const [updated] = await db.update(coaches).set(data).where(eq(coaches.id, id)).returning();
  return updated;
};

export const deleteCoach = async (id: number) => {
  const [deleted] = await db.delete(coaches).where(eq(coaches.id, id)).returning();
  return deleted;
};
