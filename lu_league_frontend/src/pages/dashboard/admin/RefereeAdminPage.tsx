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

interface referee {
  id: number;
  user_id: number;

  // user table info
  name: string;
  email: string;
  role: string;
  status: "pending" | "approved" | "rejected";

  // referee table info
  date_of_birth: string;
  gender: string;
  age: number;
  phone: string;
  nationality: string;
  address: string;
  certification_level: string;
  experience_years: number;
  matches_officiated: number;
  profile_image: string;
}

export default function RefereeAdminPage() {
  const { token } = useAuth();
  const [referee, setrefereees] = useState<referee[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingreferee, setEditingReferee] = useState<referee | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date_of_birth: "",
    gender: "",
    age: 0,
    phone: "",
    nationality: "",
    address: "",
    certification_level: "",
    experience_years: 0,
    matches_officiated: 0,
    profile_image: "",
  });

  // Fetch all referee
  const fetchreferee = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/referee/all", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch referee");
      console.log(token);
      const data: referee[] = await res.json();
      setrefereees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load referee" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchreferee();
  }, [token]);

  // Delete referee
  const handleDeleteReferee = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/referee/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setrefereees((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "referee deleted" });
    } catch (err) {
      toast({ title: "Error", description: "Could not delete referee" });
    }
  };

  // Open modals
  const openCreateModal = () => {
    setEditingReferee(null);
    setFormData({
      date_of_birth: "",
      gender: "",
      age: 0,
      phone: "",
      nationality: "",
      address: "",
      certification_level: "",
      experience_years: 0,
      matches_officiated: 0,
      profile_image: "",
    });
    setCreateOpen(true);
  };

  const openEditModal = (referee: referee) => {
    setEditingReferee(referee);
    setFormData({
      date_of_birth: referee.date_of_birth,
      gender: referee.gender,
      age: referee.age,
      phone: referee.phone,
      nationality: referee.nationality,
      address: referee.address,
      certification_level: referee.certification_level,
      experience_years: referee.experience_years,
      matches_officiated: referee.matches_officiated,
      profile_image: referee.profile_image,
    });
    setEditOpen(true);
  };

  // Create coach
  const handleCreateReferee = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/referee/register-phase2", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Create failed");
      const newreferee: referee = await res.json();
      setrefereees((prev) => [...prev, newreferee]);
      toast({ title: "referee created" });
      setCreateOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to create referee" });
    }
  };

  // Edit referee
  const handleEditReferee = async () => {
    if (!token || !editingreferee) return;
    try {
      const res = await fetch(`http://localhost:5000/api/referee/${editingreferee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      const updatedreferee: referee = await res.json();
      setrefereees((prev) => prev.map((c) => (c.id === updatedreferee.id ? updatedreferee : c)));
      toast({ title: "referee updated" });
      setEditOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to update referee" });
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading referee...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard - referees</h1>
        <Button onClick={openCreateModal}>Add referee</Button>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create referee</DialogTitle>
            <DialogDescription>Fill in referee details</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="date_of_birth"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
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
              placeholder="experience_years"
              value={formData.experience_years}
              onChange={(e) =>
                setFormData({ ...formData, experience_years: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="matches_officiated"
              value={formData.matches_officiated}
              onChange={(e) =>
                setFormData({ ...formData, matches_officiated: Number(e.target.value) })
              }
            />
            <Input
              placeholder="certification_level"
              value={formData.certification_level}
              onChange={(e) => setFormData({ ...formData, certification_level: e.target.value })}
            />
            <Select
              value={formData.gender}
              onValueChange={(v) => setFormData({ ...formData, gender: v as referee["gender"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReferee}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit referee</DialogTitle>
            <DialogDescription>Update referee details</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="date_of_birth"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
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
              placeholder="experience_years"
              value={formData.experience_years}
              onChange={(e) =>
                setFormData({ ...formData, experience_years: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="matches_officiated"
              value={formData.matches_officiated}
              onChange={(e) =>
                setFormData({ ...formData, matches_officiated: Number(e.target.value) })
              }
            />
            <Input
              placeholder="certification_level"
              value={formData.certification_level}
              onChange={(e) => setFormData({ ...formData, certification_level: e.target.value })}
            />
            <Select
              value={formData.gender}
              onValueChange={(v) => setFormData({ ...formData, gender: v as referee["gender"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditReferee}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* COACHES TABLE */}
      <div className="overflow-x-auto border rounded-lg mt-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date_of_birth</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>certification_level</TableHead>
              <TableHead>experience_years</TableHead>
              <TableHead>matches_officiated</TableHead>
              <TableHead>profile_image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referee.length > 0 ? (
              referee.map((referee) => (
                <TableRow key={referee.id} className="hover:bg-gray-50 transition">
                  <TableCell>{referee.name}</TableCell>
                  <TableCell>{referee.email}</TableCell>
                  <TableCell>{referee.date_of_birth}</TableCell>
                  <TableCell>{referee.age}</TableCell>
                  <TableCell>{referee.phone}</TableCell>
                  <TableCell>{referee.gender}</TableCell>
                  <TableCell>{referee.nationality}</TableCell>
                  <TableCell>{referee.address}</TableCell>
                  <TableCell>{referee.certification_level}</TableCell>
                  <TableCell>{referee.experience_years}</TableCell>
                  <TableCell>{referee.matches_officiated}</TableCell>
                  <TableCell>{referee.profile_image}</TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(referee)}>
                      Edit
                    </Button>
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
                            Are you sure you want to delete this referee? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteReferee(referee.id)}
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
                <TableCell colSpan={6} className="p-4 text-center text-gray-500">
                  No referees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
