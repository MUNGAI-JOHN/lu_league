// src/pages/auth/RegisterPhase1.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPhase1() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register-phase1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Redirect to phase 2 registration with role and userId
      navigate("/register/phase2", {
        state: { userId: data.userId, role: data.role },
      });
    } catch (err) {
      setError("Server error, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register - Phase 1</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full border p-2 rounded" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 rounded" required />

          <select name="role" onChange={handleChange} className="w-full border p-2 rounded" required>
            <option value="">Select Role</option>
            <option value="coach">Coach</option>
            <option value="referee">Referee</option>
            <option value="player">Player</option>
          </select>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
            {loading ? "Registering..." : "Continue to Phase 2"}
          </button>
        </form>
      </div>
    </div>
  );
}
