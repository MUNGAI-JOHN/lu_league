import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../config/db.ts"; // ✅ Import Drizzle instance
import { players, coaches, referees } from "../../drizzle/schema.ts"; // ✅ Import your role tables
import { registerPhase1, registerPhase2, loginUser } from "./auth.service.ts";

/**
 * ✅ PHASE 1: Register base user (admin, coach, referee, player)
 */
export const registerPhase1Controller = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await registerPhase1(name, email, phone, password, role);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * ✅ PHASE 2: Register extra details (coach, referee, player only)
 */
export const registerPhase2Controller = async (req: Request, res: Response) => {
  try {
    const { token, data } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: string;
    };

    const user_id = decoded.id;
    const role = decoded.role;

    // ✅ Insert data based on role
    if (role === "player") {
      await db.insert(players).values({ ...data, user_id });
    } else if (role === "coach") {
      await db.insert(coaches).values({ ...data, user_id });
    } else if (role === "referee") {
      await db.insert(referees).values({ ...data, user_id });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.status(200).json({ message: "Phase 2 registration complete" });
  } catch (err: any) {
    console.error("Phase 2 error:", err);
    res.status(400).json({ message: "Invalid or expired token", error: err.message });
  }
};

/**
 * ✅ LOGIN: Secure login for all users
 */
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await loginUser(email, password);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
};
/// backend veryfies my token so that i can see my phase2 rendered page
export const verifyTokenController = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      role: string;
      status: string;
    };

    // You can add an optional database check here if needed
    // to confirm the user still exists or is approved

    return res.status(200).json({
      id: decoded.id,
      role: decoded.role,
      status: decoded.status,
    });
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};