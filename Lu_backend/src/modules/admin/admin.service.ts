// src/modules/admin/admin.service.ts
import { db } from "../../config/db.ts";
import { users } from "../../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "coach" | "referee" | "player";
  status?: "pending" | "approved" | "rejected";
}

// --------------------------
// Create user (by admin)
// --------------------------
export const createUserByAdmin = async (data: CreateUserData) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: data.role,
      status: data.status || "approved", // Admin-created users are approved
    })
    .returning();

  return newUser;
};

// --------------------------
// Get all users
// --------------------------
export const gettAllUsers = async () => {
  return await db.select().from(users);
};

// --------------------------
// Get user by ID
// --------------------------
export const getUserById = async (id: number) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
};

// --------------------------
// Update user (approve/reject/change role)
// --------------------------
export const updateUserByAdmin = async (id: number, data: Partial<CreateUserData>) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();

  return updatedUser;
};

// --------------------------
// Delete user
// --------------------------
export const deleteUserByAdmin = async (id: number) => {
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
  return deleted;
};
// Get all pending users
export const getPendingUsers = async () => {
  return db.select().from(users).where(eq(users.status, "pending"));
};

// Approve a user
export const approveUser = async (id: number) => {
  const [updated] = await db
    .update(users)
    .set({ status: "approved" })
    .where(eq(users.id, id))
    .returning();
  return updated;
};

// Reject a user
export const rejectUser = async (id: number) => {
  const [updated] = await db
    .update(users)
    .set({ status: "rejected" })
    .where(eq(users.id, id))
    .returning();
  return updated;
};