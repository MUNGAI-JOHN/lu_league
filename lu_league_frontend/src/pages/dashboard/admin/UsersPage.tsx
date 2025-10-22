"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../../../context/Authcontext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "coach" | "referee" | "player";
  status: "pending" | "approved" | "rejected";
}

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "player" as User["role"],
    status: "pending" as User["status"],
  });

  // Fetch all users
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      console.log("data",data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not load users" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Delete user
const handleDeleteUser = async (id: number) => {
  if (!token) return;
  try {
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Delete failed");
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({ title: "User deleted" });
  } catch (err) {
    toast({ title: "Error", description: "Could not delete user" });
  }
};


  // Open modals
  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "player", status: "pending" });
    setCreateOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setEditOpen(true);
  };


  // Approve / Reject user
const updateStatus = async (id: number, action: "approve" | "reject") => {
  if (!token) return;
  try {
    const res = await fetch(`http://localhost:5000/api/admin/users/${id}/${action}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`${action} failed`);
    setUsers(prev =>
      prev.map(u => u.id === id ? { ...u, status: action === "approve" ? "approved" : "rejected" } : u)
    );
    toast({ title: action === "approve" ? "User approved" : "User rejected" });
  } catch (err) {
    toast({ title: "Error", description: "Something went wrong" });
  }
};


  // Submit functions
  const handleCreateUser = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Create failed");
      fetchUsers();
      toast({ title: "User created" });
      setCreateOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to create user" });
    }
  };

  const handleEditUser = async () => {
    if (!token || !editingUser) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchUsers();
      toast({ title: "User updated" });
      setEditOpen(false);
    } catch {
      toast({ title: "Error", description: "Failed to update user" });
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading users...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard - Users</h1>
        <Button onClick={openCreateModal}>Create User</Button>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>

          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <DialogHeader>
              <DialogTitle>Create User</DialogTitle>
              <DialogDescription>Fill in user details</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <Input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as User["role"] })}>
                <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="referee">Referee</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as User["status"] })}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateUser}>Create</Button>
            </DialogFooter>
          </DialogContent>
        
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user details</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Input placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <Input placeholder="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as User["role"] })}>
                <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="referee">Referee</SelectItem>
                  <SelectItem value="player">Player</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as User["status"] })}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button onClick={handleEditUser}>Update</Button>
          </DialogFooter>
        </DialogContent>
        </DialogPortal>
      </Dialog>

    {/* USERS TABLE */}
      <div className="overflow-x-auto border rounded-lg mt-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? users.map(user => (
              <TableRow key={user.id} className="hover:bg-gray-50 transition">
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.role === "admin" ? "bg-red-100 text-red-800" :
                    user.role === "coach" ? "bg-blue-100 text-blue-800" :
                    user.role === "referee" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>{user.role?.toUpperCase()}</span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.status === "pending" ? "bg-gray-100 text-gray-800" :
                    user.status === "approved" ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  }`}>{user.status.toUpperCase()}</span>
                </TableCell>
                <TableCell className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditModal(user)}>Edit</Button>
                  {/* Approve / Reject buttons */}
                  {user.status !== "approved" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(user.id, "approve")}>Approve</Button>
                  )}
                  {user.status !== "rejected" && (
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(user.id, "reject")}>Reject</Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="p-4 text-center text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}