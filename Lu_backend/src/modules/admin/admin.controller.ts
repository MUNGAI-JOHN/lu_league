import { Request, Response } from "express";
import {users} from "../../drizzle/schema.ts"
import {eq} from "drizzle-orm"
import jwt from "jsonwebtoken";
import {db} from "../../config/db.ts"; // adjust if your Prisma/DB instance is elsewhere
import { sendEmail } from "../../utils/email.ts"; // utility we defined earlier
import {
  createUserByAdmin,
  gettAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  getPendingUsers,
  approveUser,
  rejectUser,
} from "./admin.service.ts";

// ------------------------
// Create new user by admin
// ------------------------
export const addUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserByAdmin(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------
// Get all users
// ------------------------
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const all = await gettAllUsers();
    res.status(200).json(all);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------
// Get single user by ID
// ------------------------
export const fetchUserById = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------
// Update user (approve/reject/change role)
// ------------------------
export const modifyUser = async (req: Request, res: Response) => {
  try {
    const updated = await updateUserByAdmin(Number(req.params.id), req.body);
    res.status(200).json({ message: "User updated successfully", updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------
// Delete user
// ------------------------
export const removeUser = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteUserByAdmin(Number(req.params.id));
    res.status(200).json({ message: "User deleted successfully", deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------
// Get all pending users
// ------------------------
export const getPendingUsersController = async (_req: Request, res: Response) => {
  try {
    const pending = await getPendingUsers();
    res.json({ count: pending.length, pending });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------------
// Approve user (Admin only)
// ------------------------
export const approveUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // ✅ Step 1: Update user status (Drizzle syntax)
    const [user] = await db
      .update(users)
      .set({ status: "approved" })
      .where(eq(users.id, Number(id)))
      .returning();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Step 2: Generate a 24-hour token safely
    const jwtSecret = process.env.JWT_SECRET ?? "default-secret-key";
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "24h" }
    );

    // ✅ Step 3: Create registration phase 2 link
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";
    const phase2Link = `${frontendUrl}/register-phase2?token=${token}`;

    // ✅ Step 4: Prepare HTML email
    const html = `
      <h2>Hello ${user.name || "User"},</h2>
      <p>Your account has been approved ✅</p>
      <p>You can now continue with your registration by clicking the link below:</p>
      <a href="${phase2Link}" 
         style="padding:10px 15px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">
         Continue Registration
      </a>
      <p>This link will expire in 24 hours.</p>
      <br/>
      <p>— LU League Admin</p>
    `;

    // ✅ Step 5: Send email
    await sendEmail(user.email!, "Your LU League Account Approved", html);

    res.status(200).json({
      message: "User approved and email sent successfully",
      user,
    });
  } catch (error: any) {
    console.error("Approval error:", error);
    res.status(500).json({
      message: "Error approving user",
      error: error.message,
    });
  }
};

// ------------------------
// Reject user (Admin only)
// ------------------------
export const rejectUserController = async (req: Request, res: Response) => {
  try {
    const updated = await rejectUser(Number(req.params.id));
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User rejected successfully", user: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
