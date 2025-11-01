import { desc, eq } from "drizzle-orm";
import { db } from "../../config/db.ts";
import { news, users } from "../../drizzle/schema.ts";

// 🟩 Create a news post (by player, coach, referee, or admin)
export const createNews = async (data: any) => {
  const [newNews] = await db
    .insert(news)
    .values({
      ...data,
      status: "pending", // default when created
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning();

  return newNews;
};

// 🟨 Get all news (approved only - for public display)
export const getAllApprovedNews = async () => {
  const allNews = await db
    .select({
      id: news.id,
      title: news.title,
      content: news.content,
      image_url: news.image_url,
      role: news.role,
      author_id: news.author_id, // ✅ include it
      author_name: users.name,
      status: news.status,
      created_at: news.created_at,
      updated_at: news.updated_at,
    })
    .from(news)
    .leftJoin(users, eq(news.author_id, users.id))
    .where(eq(news.status, "approved"))
    .orderBy(desc(news.created_at)); // 🔹 sort newest first

  return allNews;
};

// 🟦 Get all pending news (Admin)
export const getPendingNews = async () => {
  const pendingNews = await db
    .select({
      id: news.id,
      title: news.title,
      content: news.content,
      image_url: news.image_url,
      role: news.role,
      author_id: news.author_id, // ✅ include it
      author_name: users.name,
      status: news.status,
      created_at: news.created_at,
      updated_at: news.updated_at,
    })
    .from(news)
    .leftJoin(users, eq(news.author_id, users.id))
    .where(eq(news.status, "pending"));

  return pendingNews;
};

// 🟧 Get single news by ID
export const getNewsById = async (id: number) => {
  const [item] = await db
    .select({
      id: news.id,
      title: news.title,
      content: news.content,
      image_url: news.image_url,
      role: news.role,
      author_id: news.author_id, // ✅ include it
      author_name: users.name,
      status: news.status,
      created_at: news.created_at,
      updated_at: news.updated_at,
    })
    .from(news)
    .leftJoin(users, eq(news.author_id, users.id))
    .where(eq(news.id, id));

  return item;
};
export const getAllNewsCreated = async () => {
  const item = await db
    .select({
      id: news.id,
      title: news.title,
      content: news.content,
      image_url: news.image_url,
      role: news.role,
      author_id: news.author_id, // ✅ include it
      author_name: users.name,
      status: news.status,
      created_at: news.created_at,
      updated_at: news.updated_at,
    })
    .from(news)
    .leftJoin(users, eq(news.author_id, users.id));
  return item;
};

// 🟫 Update news (Author can edit before approval)
export const updateNews = async (id: number, data: any) => {
  const [updated] = await db
    .update(news)
    .set({
      ...data,
      updated_at: new Date(),
    })
    .where(eq(news.id, id))
    .returning();

  return updated;
};

// 🟩 Approve news (Admin only)
export const approveNews = async (id: number) => {
  const [approved] = await db
    .update(news)
    .set({ status: "approved", updated_at: new Date() })
    .where(eq(news.id, id))
    .returning();

  return approved;
};

// 🟥 Reject news (Admin only)
export const rejectNews = async (id: number) => {
  const [rejected] = await db
    .update(news)
    .set({ status: "rejected", updated_at: new Date() })
    .where(eq(news.id, id))
    .returning();

  return rejected;
};

// 🗑️ Delete news (Admin)
export const deleteNews = async (id: number) => {
  const [deleted] = await db.delete(news).where(eq(news.id, id)).returning();
  return deleted;
};
