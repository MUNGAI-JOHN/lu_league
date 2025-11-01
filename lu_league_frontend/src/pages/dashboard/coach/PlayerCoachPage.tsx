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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Player {
  id: number;
  player_id: number;

  // player table info
  name: string;
  email: string;
  role: string;
  status: "pending" | "approved" | "rejected";

  // player table info
  date_of_birth: string;
  gender: string;
  nationality: string;
  phone: string;
  address: string;
  age: number;
  position: string;
  isSubstitute: string;
  jersey_number: number;
  join_code: string;
  team_approval: string;
  height: string;
  weight: string;
  preferred_foot: string;
  injury_status: string;
  fitness_level: string;
  profile_image: string;
  team_id: number;
  team_name: string;
  coach_name: string;
}

export default function PlayerAdminPage() {
  const { user, token } = useAuth();
  const userId = user?.id;
  const [player, setPlayeres] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date_of_birth: "",
    gender: "",
    nationality: "",
    phone: "",
    address: "",
    age: 0,
    position: "",
    jersey_number: 0,
    team_approval: "",
    height: "",
    weight: "",
    preferred_foot: "",
    injury_status: "",
    fitness_level: "",
    profile_image: "",
    team_name: "",
    coach_name: "",
  });

  // Fetch all player
  const fetchPlayer = async () => {
    if (!token || !userId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/player/coach/${userId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch player");
      console.log(token);
      const data: Player[] = await res.json();
      setPlayeres(Array.isArray(data) ? data : []);
      console.log(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load player" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayer();
  }, [token]);

  // Delete player
  const handleDeletePlayer = async (id: number) => {
    //console.log(id);
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/player/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      console.log(res);
      if (!res.ok) throw new Error("Delete failed");
      setPlayeres((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Player deleted" });
    } catch (err) {
      toast({ title: "Error", description: "Could not delete player" });
    }
  };

  // Open modals
  const openCreateModal = () => {
    setEditingPlayer(null);
    setFormData({
      date_of_birth: "",
      gender: "",
      nationality: "",
      phone: "",
      address: "",
      age: 0,
      position: "",
      jersey_number: 0,
      team_approval: "",
      height: "",
      weight: "",
      preferred_foot: "",
      injury_status: "",
      fitness_level: "",
      profile_image: "",
      team_name: "",
      coach_name: "",
    });
    setCreateOpen(true);
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      date_of_birth: player.date_of_birth,
      gender: player.gender,
      nationality: player.nationality,
      phone: player.phone,
      address: player.address,
      age: player.age,
      position: player.position,
      jersey_number: player.jersey_number,
      team_approval: player.team_approval,
      height: player.height,
      weight: player.weight,
      preferred_foot: player.preferred_foot,
      injury_status: player.injury_status,
      fitness_level: player.fitness_level,
      profile_image: player.profile_image,
      team_name: player.name,
      coach_name: player.name,
    });
    setEditOpen(true);
  };
  // Approve / Reject player
  const updateStatus = async (player_id: number, team_id: number, action: "approve" | "reject") => {
    console.log(player_id);
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/player/${player_id}/${action}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ team_id }),
      });
      console.log(res);
      if (!res.ok) throw new Error(`${action} failed`);
      setPlayeres((prev) =>
        prev.map((u) =>
          u.player_id === player_id
            ? { ...u, status: action === "approve" ? "approved" : "rejected" }
            : u
        )
      );
      toast({ title: action === "approve" ? "Player approved" : "Player rejected" });
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong" });
    }
  };

  // Create coach
  const handleCreatePlayer = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/player/register-phase2", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Create failed");
      const newPlayer: Player = await res.json();
      setPlayeres((prev) => [...prev, newPlayer]);
      toast({ title: "Player created" });
      setCreateOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to create player" });
    }
  };

  // Edit player
  const handleEditPlayer = async () => {
    // console.log(editingPlayer);
    if (!token || !editingPlayer) return;
    try {
      const res = await fetch(`http://localhost:5000/api/player/${editingPlayer.player_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      const updatedplayer: Player = await res.json();
      setPlayeres((prev) => prev.map((c) => (c.id === updatedplayer.id ? updatedplayer : c)));
      toast({ title: "Player updated" });
      setEditOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to update player" });
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading player...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Coach Dashboard - Players</h1>
        <Button onClick={openCreateModal}>Add player</Button>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Player</DialogTitle>
            <DialogDescription>Fill in player details</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="date_of_birth"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
            <Input
              placeholder="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            />
            <Input
              placeholder="nationality"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              placeholder="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              type="number"
              placeholder="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="jersey_number"
              value={formData.jersey_number}
              onChange={(e) => setFormData({ ...formData, jersey_number: Number(e.target.value) })}
            />
            <Input
              placeholder="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Select
              value={formData.gender}
              onValueChange={(v) => setFormData({ ...formData, gender: v as Player["gender"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="height"
              placeholder="height"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
            <Input
              type="weight"
              placeholder="weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
            <Input
              type="preferred_foot"
              placeholder="preferred_foot"
              value={formData.preferred_foot}
              onChange={(e) => setFormData({ ...formData, preferred_foot: e.target.value })}
            />
            <Input
              type="injury_status"
              placeholder="injury_status"
              value={formData.injury_status}
              onChange={(e) => setFormData({ ...formData, injury_status: e.target.value })}
            />
            <Input
              type="fitness_level"
              placeholder="fitness_level"
              value={formData.fitness_level}
              onChange={(e) => setFormData({ ...formData, fitness_level: e.target.value })}
            />
            <Input
              type="coach_name"
              placeholder="coach_name"
              value={formData.coach_name}
              onChange={(e) => setFormData({ ...formData, coach_name: e.target.value })}
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlayer}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>Update player details</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="date_of_birth"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
            <Input
              placeholder="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            />
            <Input
              placeholder="nationality"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              placeholder="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              type="number"
              placeholder="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="jersey_number"
              value={formData.jersey_number}
              onChange={(e) => setFormData({ ...formData, jersey_number: Number(e.target.value) })}
            />
            <Input
              placeholder="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Select
              value={formData.gender}
              onValueChange={(v) => setFormData({ ...formData, gender: v as Player["gender"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="height"
              placeholder="height"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            />
            <Input
              type="weight"
              placeholder="weight"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            />
            <Input
              type="preferred_foot"
              placeholder="preferred_foot"
              value={formData.preferred_foot}
              onChange={(e) => setFormData({ ...formData, preferred_foot: e.target.value })}
            />
            <Input
              type="injury_status"
              placeholder="injury_status"
              value={formData.injury_status}
              onChange={(e) => setFormData({ ...formData, injury_status: e.target.value })}
            />
            <Input
              type="fitness_level"
              placeholder="fitness_level"
              value={formData.fitness_level}
              onChange={(e) => setFormData({ ...formData, fitness_level: e.target.value })}
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPlayer}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PLAYERS TABLE */}
      <div className="overflow-x-auto border rounded-lg mt-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>id</TableHead>
              <TableHead>player_id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date_of_birth</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>position</TableHead>
              <TableHead>jersey_number</TableHead>
              <TableHead>join_code</TableHead>
              <TableHead>height</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>preferred_foot</TableHead>
              <TableHead>injury_status</TableHead>
              <TableHead>fitness_level</TableHead>
              <TableHead>profile_image</TableHead>
              <TableHead>team_name</TableHead>
              <TableHead>Coach_name</TableHead>
              <TableHead>team_approval</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {player.length > 0 ? (
              player.map((player) => (
                <TableRow
                  key={player.id || player.player_id}
                  className="hover:bg-gray-50 transition"
                >
                  <TableCell>{player.id}</TableCell>
                  <TableCell>{player.player_id}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.email}</TableCell>
                  <TableCell>{player.date_of_birth}</TableCell>
                  <TableCell>{player.age}</TableCell>
                  <TableCell>{player.phone}</TableCell>
                  <TableCell>{player.gender}</TableCell>
                  <TableCell>{player.nationality}</TableCell>
                  <TableCell>{player.address}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.jersey_number}</TableCell>
                  <TableCell>{player.join_code}</TableCell>
                  <TableCell>{player.height}</TableCell>
                  <TableCell>{player.weight}</TableCell>
                  <TableCell>{player.preferred_foot}</TableCell>
                  <TableCell>{player.injury_status}</TableCell>
                  <TableCell>{player.fitness_level}</TableCell>
                  <TableCell>{player.profile_image}</TableCell>
                  <TableCell>{player.team_name}</TableCell>
                  <TableCell>{player.coach_name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        player.team_approval === "pending"
                          ? "bg-gray-100 text-gray-800"
                          : player.team_approval === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {player.team_approval.toUpperCase()}
                    </span>
                  </TableCell>

                  <TableCell className="flex items-center gap-2">
                    {/* ✏️ Edit button */}
                    <Button size="sm" variant="outline" onClick={() => openEditModal(player)}>
                      Edit
                    </Button>
                    {/* ✅ Approve / ❌ Reject buttons (only if not approved) */}
                    {player.team_approval !== "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(player.player_id, player.team_id, "approve")}
                      >
                        Approve
                      </Button>
                    )}
                    {player.team_approval !== "rejected" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Reject</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this player?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                updateStatus(player.player_id, player.team_id, "reject")
                              }
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {/* Delete button  */}
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
                            Are you sure you want to delete this player? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePlayer(player.id)}
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
                <TableCell colSpan={20} className="p-4 text-center text-gray-500">
                  No players found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
