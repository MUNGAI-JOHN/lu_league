import { eq } from "drizzle-orm";
import { db } from "../../config/db.ts";
import { referees, users } from "../../drizzle/schema.ts"; // ✅ add users table

export const createReferee = async (refereeData: {
  user_id: number;
  date_of_birth: string;
  gender?: string;
  nationality?: string;
  address?: string;
  certification_level?: string;
  experience_years?: number;
  status?: string;
  matches_officiated?: number;
  profile_image?: string;
  joining_date?: string;
  contract_end_date?: string;
}) => {
  // ✅ 1. Check if this referee already exists (to prevent re-submission)
  const existing = await db.query.referees.findFirst({
    where: (r, { eq }) => eq(r.user_id, refereeData.user_id),
  });

  if (existing) {
    throw new Error("Phase 2 registration already completed.");
  }

  // ✅ 2. Create referee record
  const [newReferee] = await db.insert(referees).values(refereeData).returning();

  // ✅ 3. Mark phase 2 as completed in users table
  await db.update(users).set({ phase2_completed: true }).where(eq(users.id, refereeData.user_id));

  return newReferee;
};

export const getAllReferees = async () => {
  try {
    const allReferees = await db
      .select({
        // --- referee info ---
        id: referees.id,
        user_id: referees.user_id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        date_of_birth: referees.date_of_birth,
        gender: referees.gender,
        nationality: referees.nationality,
        phone: referees.phone,
        address: referees.address,
        age: referees.age,
        certification_level: referees.certification_level,
        experience_years: referees.experience_years,
        matches_officiated: referees.matches_officiated,
        profile_image: referees.profile_image,
      })
      .from(referees)
      .leftJoin(users, eq(referees.user_id, users.id));

    return allReferees;
  } catch (err) {
    console.error("Error in getAllplayers:", err);
    throw err; // rethrow to be caught by controller
  }
};

export const getRefereeById = async (id: number) => {
  const [referee] = await db.select().from(referees).where(eq(referees.id, id));
  return referee;
};

export const updateReferee = async (id: number, data: any) => {
  const [updated] = await db.update(referees).set(data).where(eq(referees.id, id)).returning();
  return updated;
};

export const deleteReferee = async (id: number) => {
  const [deleted] = await db.delete(referees).where(eq(referees.id, id)).returning();
  return deleted;
};
