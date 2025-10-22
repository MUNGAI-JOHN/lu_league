// src/modules/results/results.routes.ts
import { Router } from "express";
import { authenticateJWT } from "../auth/auth.middleware.ts";
import {
  addResult,
  editResult,
  approveResult,
  getAllResults,
  getResultById,
} from "./results.controller.ts";

const router = Router();

router.post("/", authenticateJWT, addResult);             // Referee/Admin
router.put("/:id", authenticateJWT, editResult);          // Referee/Admin
router.put("/:id/approve", authenticateJWT, approveResult); // Admin only
router.get("/", authenticateJWT, getAllResults);
router.get("/:id", authenticateJWT, getResultById);

export default router;
