"use client";

import Button from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/Authcontext";

interface News {
  id: number;
  title: string;
  content: string;
  image_url: string;
  author_name: string;
  created_at: string;
  status: string;
}

export default function NewsAdminPage() {
  const { token, user } = useAuth();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [formData, setFormData] = useState({ title: "", description: "", image_url: "" });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // ✅ Fetch all news
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/news/all");
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();

      // ✅ Ensure it's always an array
      const normalized = Array.isArray(data) ? data : [data];
      setNewsList(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [token]);

  // ✅ Approve news
  const handleApproveNews = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/news/${id}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to approve news");

      toast({ title: "✅ News approved successfully!" });
      fetchNews();
    } catch (err) {
      toast({ title: "Error", description: "Could not approve news" });
    }
  };

  // ❌ Reject news
  const handleRejectNews = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/news/${id}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to reject news");

      toast({ title: "❌ News rejected successfully!" });
      fetchNews();
    } catch (err) {
      toast({ title: "Error", description: "Could not reject news" });
    }
  };

  // ✅ Handle create news
  const handleCreateNews = async () => {
    if (!formData.title || !formData.description) {
      toast({ title: "Error", description: "Please fill in all fields" });
      return;
    }
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/news/create-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.description, // ✅ use 'content' instead of 'description'
          image_url: formData.image_url,
        }),
      });
      if (!res.ok) throw new Error("Failed to create news");

      toast({ title: "News created successfully!" });
      setFormData({ title: "", description: "", image_url: "" });
      setOpen(false);
      fetchNews();
    } catch (err) {
      toast({ title: "Error", description: "Could not create news" });
    }
  };

  // ✅ Handle delete
  const handleDeleteNews = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete news");
      toast({ title: "News deleted" });
      setNewsList((prev) => prev.filter((n) => n.id !== id));
    } catch {
      toast({ title: "Error", description: "Could not delete news" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ➕ CREATE BUTTON */}
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white">Create News</Button>
          </DialogTrigger>

          {/* 💬 POPUP FORM */}
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-700">Create News</DialogTitle>
            </DialogHeader>

            <Card className="shadow-none border-none">
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter News Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Textarea
                  placeholder="Write News Description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Input
                  placeholder="Enter Image URL (optional)"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="rounded-md w-full h-48 object-cover border mt-2"
                  />
                )}
              </CardContent>

              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateNews}
                  disabled={!formData.title || !formData.description}
                >
                  Post News
                </Button>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🧾 NEWS TABLE */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>status</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : newsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No news found
                </TableCell>
              </TableRow>
            ) : (
              newsList.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>
                    {n.image_url ? (
                      <img
                        src={n.image_url}
                        alt={n.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{n.title}</TableCell>
                  <TableCell>{n.content}</TableCell>
                  <TableCell>{n.author_name}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        n.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : n.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {n.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(n.created_at).toLocaleString()}</TableCell>
                  <TableCell className="space-x-2">
                    {user?.role === "admin" && n.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 text-white"
                          onClick={() => handleApproveNews(n.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 text-white"
                          onClick={() => handleRejectNews(n.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteNews(n.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
