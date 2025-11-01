import { Request, Response } from "express";
import { AuthRequest } from "../auth/auth.middleware.ts";
import * as newsService from "./news.service.ts";

// 🟩 Create News — Player, Coach, Referee, or Admin
export const createNews = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    // Only authenticated users with valid roles can post
    if (!["player", "coach", "referee", "admin"].includes(user.role)) {
      return res.status(403).json({ error: "Access denied — invalid role" });
    }

    const newsData = {
      ...req.body,
      author_id: user.id,
      role: user.role,
    };

    const created = await newsService.createNews(newsData);
    console.log(created);
    res.status(201).json({ message: "News submitted successfully", news: created });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🟨 Get All Approved News (Public)
export const getAllApprovedNew = async (_req: Request, res: Response) => {
  try {
    const newsList = await newsService.getAllApprovedNews();
    res.json(newsList);
    console.log(newsList);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🟦 Get All Pending News (Admin)
export const getPendingNews = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — Admin only" });
    }

    const pending = await newsService.getPendingNews();
    res.json(pending);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Get Single News by ID
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const item = await newsService.getNewsById(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "News not found" });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 📘 Get Single News by ID
export const getAllNews = async (req: Request, res: Response) => {
  try {
    const item = await newsService.getAllNewsCreated();
    if (!item) return res.status(404).json({ message: "News not found" });
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✏️ Update News (Author can edit before approval)
export const updateNews = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const existing = await newsService.getNewsById(Number(req.params.id));

    if (!existing) return res.status(404).json({ message: "News not found" });

    // Author or Admin can update
    if (user.id !== existing.author_id && user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — not your news" });
    }

    // Only pending or rejected news can be edited
    if (existing.status === "approved" && user.role !== "admin") {
      return res.status(403).json({ error: "Cannot edit approved news" });
    }

    const updated = await newsService.updateNews(Number(req.params.id), req.body);
    res.json({ message: "News updated successfully", updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Approve News — Admin Only
export const approveNews = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — Admin only" });
    }

    const approved = await newsService.approveNews(Number(req.params.id));
    if (!approved) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News approved successfully", approved });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ Reject News — Admin Only
export const rejectNews = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — Admin only" });
    }

    const rejected = await newsService.rejectNews(Number(req.params.id));
    if (!rejected) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News rejected successfully", rejected });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete News — Admin Only
export const deleteNews = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied — Admin only" });
    }

    const deleted = await newsService.deleteNews(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted successfully", deleted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
