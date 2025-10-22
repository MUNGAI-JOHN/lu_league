// src/modules/admin/admin.routes.ts
import { Router } from "express";
import {
  addUser,
  getAllUsers,
  fetchUserById,
  modifyUser,
  removeUser,
  getPendingUsersController,
  approveUserController,
  rejectUserController,
} from "./admin.controller.ts";
import { authenticateJWT, isAdmin } from "../auth/auth.middleware.ts"; // existing middleware

const router = Router();

// Admin-only routes
router.get("/users/pending", authenticateJWT, isAdmin, getPendingUsersController);
router.put("/users/:id/approve", authenticateJWT, isAdmin, approveUserController);
router.put("/users/:id/reject", authenticateJWT, isAdmin, rejectUserController);


// Only admin can access these routes
router.post("/create-user", authenticateJWT, isAdmin, addUser);
router.get("/users", authenticateJWT, isAdmin, getAllUsers);
router.get("/users/:id", authenticateJWT, isAdmin, fetchUserById);
router.patch("/users/:id", authenticateJWT, isAdmin, modifyUser);
router.delete("/users/:id", authenticateJWT, isAdmin, removeUser);


export default router;
