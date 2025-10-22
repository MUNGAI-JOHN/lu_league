// src/modules/results/results.controller.ts
import { Request, Response } from "express";
import { AuthRequest } from "../auth/auth.middleware.ts";
import * as resultService from "./results.service.ts";

// 🎯 Create Result — Referee or Admin
export const addResult = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "referee" && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — Referee/Admin only" });
    }

    const result = await resultService.createResult(req.body);
    res.status(201).json({ message: "Result created successfully", result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update Result — Referee/Admin
export const editResult = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "referee" && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — Referee/Admin only" });
    }

    const updated = await resultService.updateResult(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: "Result not found" });
    res.json({ message: "Result updated successfully", updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Approve Result — Admin only + Auto standings update
export const approveResult = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — Admin only" });
    }

    const approved = await resultService.approveResult(Number(req.params.id));
    if (!approved) return res.status(404).json({ message: "Result not found" });

    res.json({
      message: "Result approved and standings updated successfully",
      approved,
    });
  } catch (error: any) {
    console.error("Approval error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 📋 Get All Results (with joined names)
export const getAllResults = async (_req: Request, res: Response) => {
  try {
    const results = await resultService.getAllResultsWithDetails();
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Get One Result
export const getResultById = async (req: Request, res: Response) => {
  try {
    const result = await resultService.getResultById(Number(req.params.id));
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
