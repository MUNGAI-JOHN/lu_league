import { Request, Response } from "express";
import {
  createCoach,
  getAllCoaches,
  getCoachById,
  updateCoach,
  deleteCoach,
} from "./coach.service.ts";
import { authenticateJWT } from "../auth/auth.middleware.ts";

export const registerCoachPhase2 = async (req: Request, res: Response) => {
  try {
    const user = req.user as { id: number; role: string };

    if (user.role !== "coach" && user.role !== "admin") {
      return res.status(403).json({ error: "Only coaches and admin can register this data" });
    }

    const {
      date_of_birth,
      gender,
      nationality,
      email,
      phone_number,
      address,
      specialization,
      experience_years,
      certifications,
      joining_date,
      contract_end_date,
      salary,
      status,
      profile_image,
    } = req.body;

    const coach = await createCoach({
      user_id: user.id,
      date_of_birth,
      gender,
      nationality,
      email,
      phone_number,
      address,
      specialization,
      experience_years,
      certifications,
      joining_date,
      contract_end_date,
      salary,
      status,
      profile_image,
    });

    return res.status(201).json({
      message: "Coach profile created successfully",
      coach,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error creating coach profile" });
  }
};

// GET all coaches
export const getCoaches = async (req: Request, res: Response) => {
  try {
    const data = await getAllCoaches();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coaches" });
  }
};

// GET coach by ID
export const getCoach = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const coach = await getCoachById(id);
    if (!coach) return res.status(404).json({ error: "Coach not found" });
    res.json(coach);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coach" });
  }
};

// UPDATE coach
export const editCoach = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await updateCoach(id, req.body);
    res.json({ message: "Coach updated successfully", updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update coach" });
  }
};

// DELETE coach
export const removeCoach = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await deleteCoach(id);
    res.json({ message: "Coach deleted successfully", deleted });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete coach" });
  }
};
