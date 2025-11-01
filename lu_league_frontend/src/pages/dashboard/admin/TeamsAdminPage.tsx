"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/Authcontext";

interface Team {
  id: number;
  name: string;
  abbreviation?: string;
  founded_year?: number;
  city?: string;
  stadium_name?: string;
  coach_id: number;
  country?: string;
  join_code?: string;
  approval_status: "pending" | "approved" | "rejected";
  created_by: string;
  team_logo?: string;
  created_at?: string;
}
export default function TeamsPage() {
  const { token } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    founded_year: "",
    city: "",
    stadium_name: "",
    coach_id: "",
    country: "",
    approval_status: "pending" as Team["approval_status"],
  });

  // 🔹 Fetch all teams
  const fetchTeams = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/team/all", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch teams");
      const data: Team[] = await res.json();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load teams" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [token]);

  // 🔹 Delete team
  const handleDeleteTeam = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/team/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setTeams((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Team deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Could not delete team" });
    }
  };

  // 🔹 Modals
  const openCreateModal = () => {
    setEditingTeam(null);
    setFormData({
      name: "",
      abbreviation: "",
      founded_year: "",
      city: "",
      stadium_name: "",
      coach_id: "",
      country: "",
      approval_status: "pending",
    });
    setCreateOpen(true);
  };

  const openEditModal = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      abbreviation: team.abbreviation || "",
      founded_year: team.founded_year?.toString() || "",
      city: team.city || "",
      stadium_name: team.stadium_name || "",
      coach_id: team.coach_id.toString(),
      country: team.country || "",
      approval_status: team.approval_status,
    });
    setEditOpen(true);
  };

  // 🔹 Approve / Reject
  const updateStatus = async (id: number, action: "approve" | "reject") => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/team/${id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${action} failed`);
      setTeams((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, approval_status: action === "approve" ? "approved" : "rejected" }
            : t
        )
      );
      toast({
        title: action === "approve" ? "Team approved" : "Team rejected",
      });
    } catch {
      toast({ title: "Error", description: "Status update failed" });
    }
  };

  // 🔹 Create team
  const handleCreateTeam = async () => {
    if (!token) return;

    if (!formData.coach_id) {
      toast({ title: "Error", description: "Coach ID is required" });
      return;
    }

    const payload = {
      ...formData,
      coach_id: Number(formData.coach_id),
      founded_year: formData.founded_year ? Number(formData.founded_year) : undefined,
      approval_status: "approved",
    };

    try {
      const res = await fetch("http://localhost:5000/api/team/create-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Create failed");

      fetchTeams();
      toast({ title: "Team created successfully" });
      setCreateOpen(false);
    } catch (err) {
      console.error("Error creating team:", err);
      toast({ title: "Error", description: "Failed to create team" });
    }
  };

  // 🔹 Edit team
  const handleEditTeam = async () => {
    if (!token || !editingTeam) return;
    try {
      const res = await fetch(`http://localhost:5000/api/team/${editingTeam.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchTeams();
      toast({ title: "Team updated successfully" });
      setEditOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to update team" });
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading teams...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard - Teams</h1>
        <Button onClick={openCreateModal}>Create Team</Button>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>Enter new team details</DialogDescription>
          </DialogHeader>

          {/* ✅ use <form> with onSubmit */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateTeam();
            }}
            className="flex flex-col gap-3 mt-4"
          >
            {[
              "name",
              "abbreviation",
              "founded_year",
              "city",
              "stadium_name",
              "coach_id",
              "country",
            ].map((field) => (
              <Input
                key={field}
                placeholder={field.replace("_", " ").toUpperCase()}
                type={field === "founded_year" || field === "coach_id" ? "number" : "text"}
                value={(formData as any)[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                required={field === "name"}
              />
            ))}

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Modify team information</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditTeam();
            }}
            className="flex flex-col gap-3 mt-4"
          >
            {["name", "abbreviation", "city", "country"].map((field) => (
              <Input
                key={field}
                placeholder={field.replace("_", " ").toUpperCase()}
                value={(formData as any)[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                required={field === "name"}
              />
            ))}

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* TEAMS TABLE */}
      <div className="overflow-x-auto border rounded-lg mt-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Coach ID</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.length > 0 ? (
              teams.map((team) => (
                <TableRow key={team.id} className="hover:bg-gray-50 transition">
                  <TableCell>
                    {team.team_logo ? (
                      <img
                        src={team.team_logo}
                        alt={team.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell>{team.coach_id}</TableCell>
                  <TableCell>{team.city || "-"}</TableCell>
                  <TableCell>{team.country || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        team.approval_status === "approved"
                          ? "bg-green-100 text-green-800"
                          : team.approval_status === "pending"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {team.approval_status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(team)}>
                      Edit
                    </Button>

                    {team.approval_status !== "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(team.id, "approve")}
                      >
                        Approve
                      </Button>
                    )}

                    {team.approval_status !== "rejected" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Team</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this team?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => updateStatus(team.id, "reject")}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this team? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTeam(team.id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="p-4 text-center text-gray-500">
                  No teams found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
