import { Router } from "express";
import {
  registerPhase1Controller,
  registerPhase2Controller,
  loginController,
} from "./auth.controller.ts";
import { verifyTokenController } from "./auth.controller.ts";

const router = Router();

router.post("/register-phase1", registerPhase1Controller);
router.post("/login", loginController);

// ✅ Add this new route
router.post("/verify-token", verifyTokenController);

// ⚙️ Enable later when Phase 2 form is ready
router.post("/register-phase2", registerPhase2Controller);

export default router;
