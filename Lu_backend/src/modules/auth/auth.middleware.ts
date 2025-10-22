// src/modules/auth/auth.middleware.ts
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export interface AuthRequest extends Request {
  user?: any;
}

// Authenticate JWT token
export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Access denied — Admin only" });
  }

  next();
};
