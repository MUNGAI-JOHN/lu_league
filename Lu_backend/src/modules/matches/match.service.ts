import { db } from "../../config/db.ts";
import { matches } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";

export const createMatch = async (data: any) => {
  const [newMatch] = await db.insert(matches).values(data).returning();
  return newMatch;
};

export const getAllMatches = async () => {
  return await db.select().from(matches);
};

export const getMatchById = async (id: number) => {
  const [match] = await db.select().from(matches).where(eq(matches.id, id));
  return match;
};

export const updateMatch = async (id: number, data: any) => {
  // Safely convert match_date (if it exists) to a Date object
  const formattedData = {
    ...data,
    ...(data.match_date && { match_date: new Date(data.match_date) }),
    updated_at: new Date(),
  };

  const [updated] = await db
    .update(matches)
    .set(formattedData)
    .where(eq(matches.id, id))
    .returning();

  return updated;
};


export const deleteMatch = async (id: number) => {
  const [deleted] = await db.delete(matches).where(eq(matches.id, id)).returning();
  return deleted;
};
