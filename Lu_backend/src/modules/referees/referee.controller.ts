import { Request, Response } from "express";
import {
  createReferee,
  getAllReferees,
  getRefereeById,
  updateReferee,
  deleteReferee,
} from "./referee.service.ts";
import jwt from "jsonwebtoken";

export const addReferee = async (req: Request, res: Response) => {
  try {
    // Extract user_id from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const user_id = decoded.id;

    const refereeData = { ...req.body, user_id };
    const referee = await createReferee(refereeData);

    res.status(201).json({ message: "Referee profile created successfully", referee });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getReferees = async (req: Request, res: Response) => {
  try {
    const data = await getAllReferees();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getReferee = async (req: Request, res: Response) => {
  try {
    const referee = await getRefereeById(Number(req.params.id));
    if (!referee) return res.status(404).json({ message: "Referee not found" });
    res.json(referee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const editReferee = async (req: Request, res: Response) => {
  try {
    const updated = await updateReferee(Number(req.params.id), req.body);
    res.json({ message: "Referee updated successfully", updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeReferee = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteReferee(Number(req.params.id));
    res.json({ message: "Referee deleted successfully", deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
