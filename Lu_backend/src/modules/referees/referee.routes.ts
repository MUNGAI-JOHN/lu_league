import { Router } from "express";
import {
  addReferee,
  getReferees,
  getReferee,
  editReferee,
  removeReferee,
} from "./referee.controller.ts";
import { authenticateJWT } from "../auth/auth.middleware.ts";

const router = Router();

// Phase 2 registration (protected)
router.post("/register-phase2", authenticateJWT, addReferee);

// CRUD
router.get("/", getReferees);
router.get("/:id", getReferee);
router.put("/:id", authenticateJWT, editReferee);
router.delete("/:id", authenticateJWT, removeReferee);

export default router;
