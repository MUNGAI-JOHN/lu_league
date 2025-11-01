"use client";

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

interface Coach {
  id: number;
  user_id: number;

  // user table info
  name: string;
  email: string;
  role: string;
  status: "pending" | "approved" | "rejected";

  // coach table info
  date_of_birth: string;
  age: number;
  gender: string;
  nationality: string;
  phone: string;
  address: string;
  experience_years: number;
  certifications: string;
  profile_image?: string;
}

export default function CoachesAdminPage() {
  const { user, token } = useAuth();
  const userId = user?.id;
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [editOpen, setEditOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    date_of_birth: "",
    age: 0,
    gender: "",
    nationality: "",
    phone: "",
    address: "",
    experience_years: 0,
    certifications: "",
  });

  // Fetch all coaches
  const fetchCoaches = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/coach/${userId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      console.log(res);
      if (!res.ok) throw new Error("Failed to fetch coaches");
      const data: Coach[] = await res.json();
      console.log(data);
      setCoaches(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load coaches" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [token]);

  const openEditModal = (coach: Coach) => {
    setEditingCoach(coach);
    setFormData({
      date_of_birth: coach.date_of_birth,
      age: coach.age,
      phone: coach.phone,
      gender: coach.gender,
      nationality: coach.nationality,
      address: coach.address,
      experience_years: coach.experience_years,
      certifications: coach.certifications,
    });
    setEditOpen(true);
  };

  // Edit coach
  const handleEditCoach = async () => {
    if (!token || !editingCoach) return;
    try {
      const res = await fetch(`http://localhost:5000/api/coach/${editingCoach.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      const updatedCoach: Coach = await res.json();
      setCoaches((prev) => prev.map((c) => (c.id === updatedCoach.id ? updatedCoach : c)));
      toast({ title: "Coach updated" });
      setEditOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to update coach" });
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading coaches...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Coach Dashboard - Coach</h1>
      </div>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Coach</DialogTitle>
            <DialogDescription>Update coach details</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="date_of_birth"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
            <Input
              type="number"
              placeholder="age"
              value={formData.age ?? ""}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
            />
            <Input
              type="text"
              placeholder="Phone"
              value={formData.phone ?? ""}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, ""); // remove non-numeric
                setFormData({ ...formData, phone: onlyNums });
              }}
            />
            <Input
              placeholder="nationality"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Experience Years"
              value={formData.experience_years}
              onChange={(e) =>
                setFormData({ ...formData, experience_years: Number(e.target.value) })
              }
            />
            <Input
              placeholder="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Select
              value={formData.gender}
              onValueChange={(v) => setFormData({ ...formData, gender: v as Coach["gender"] })}
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
              type="certifications"
              placeholder="certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCoach}>Update</Button>
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
              <TableHead>Experience</TableHead>
              <TableHead>certifications</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coaches.length > 0 ? (
              coaches.map((coach) => (
                <TableRow key={coach.id} className="hover:bg-gray-50 transition">
                  <TableCell>{coach.name}</TableCell>
                  <TableCell>{coach.email}</TableCell>
                  <TableCell>{coach.date_of_birth}</TableCell>
                  <TableCell>{coach.age}</TableCell>
                  <TableCell>{coach.phone}</TableCell>
                  <TableCell>{coach.gender}</TableCell>
                  <TableCell>{coach.nationality}</TableCell>
                  <TableCell>{coach.address}</TableCell>
                  <TableCell>{coach.experience_years}</TableCell>
                  <TableCell>{coach.certifications}</TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(coach)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="p-4 text-center text-gray-500">
                  No coaches found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
