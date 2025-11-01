import { Router } from "express";
import { authenticateJWT } from "../auth/auth.middleware.ts";
import {
  addReferee,
  editReferee,
  getReferee,
  getReferees,
  removeReferee,
} from "./referee.controller.ts";

const router = Router();

// Phase 2 registration (protected)
router.post("/register-phase2", authenticateJWT, addReferee);

// CRUD
router.get("/all", getReferees);
router.get("/:id", getReferee);
router.patch("/:id", authenticateJWT, editReferee);
router.delete("/:id", authenticateJWT, removeReferee);

export default router;
