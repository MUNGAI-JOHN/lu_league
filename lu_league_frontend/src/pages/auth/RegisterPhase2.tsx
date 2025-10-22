import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Define the token payload structure
interface Phase2TokenPayload {
  id: number;
  role: "player" | "coach" | "referee";
  email: string;
}

// ----- FORM TYPES -----
type PlayerForm = {
  date_of_birth: string;
  gender: "male" | "female" | "";
  age: string;
  nationality: string;
  position: string;
  jersey_number?: string;
  join_code?: string;
  height?: string;
  weight?: string;
  preferred_foot?: string;
  injury_status?: string;
  fitness_level?: string;

};

type CoachForm = {
  date_of_birth: string;
  gender: "male" | "female" | "";
  nationality: string;
  age: string;
  address: string;
  specialization: string;
  experience_years?: string;
  certifications?: string;

};

type RefereeForm = {
  date_of_birth: string;
  gender: "male" | "female" | "";
  age: string;
  nationality: string;
  address: string;
  specialization: string;
  experience_years?: string;
  matches_officiated?: string;
  certification_level: string;

};

// ----- MAIN COMPONENT -----
export default function RegisterPhase2() {
  const location = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState<Phase2TokenPayload["role"] | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PlayerForm | CoachForm | RefereeForm>({} as any);

  // ✅ Read token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode<Phase2TokenPayload>(token);
      setRole(decoded.role);
      setUserId(decoded.id);
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/login");
    }
  }, [location.search, navigate]);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Validate required fields per role
  const validateForm = () => {
    if (!role) return false;
    const requiredFields =
      role === "player"
        ? ["date_of_birth", "gender", "nationality", "position"]
        : ["date_of_birth", "gender", "nationality", "address", "specialization"];
    return requiredFields.every((field) => (form as any)[field]);
  };

  // ✅ Submit Phase 2 Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data before submit:", form);

    if (!validateForm()) {
      setError("Please fill all required fields.");
      return;
    }

    if (!role || !userId) {
      setError("Invalid session. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✅ Choose correct endpoint based on role
      let endpoint = "";
      if (role === "player") endpoint = "http://localhost:5000/api/player/register-phase2";
      else if (role === "coach") endpoint = "http://localhost:5000/api/coach/register-phase2";
      else if (role === "referee") endpoint = "http://localhost:5000/api/referee/register-phase2";

      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token in header
        },
        body: JSON.stringify({
          ...form,
          user_id: userId, // ✅ ensure user_id is sent
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Phase 2 registration failed.");
        return;
      }

      alert("✅ Phase 2 registration complete! Await admin approval.");
      navigate("/login");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render form fields based on role
  const renderFields = () => {
    if (!role) return null;

    switch (role) {
      case "player":
        return (
          <>
           <label>Date of Birth:</label>
            <input  type="date"  name="date_of_birth" value={(form as CoachForm ).date_of_birth || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <label>Gender:</label>
            <select name="gender" value={(form as CoachForm ).gender || ""} onChange={handleChange} required  className="w-full border p-2 rounded" >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input name="nationality" placeholder="Nationality"value={(form as CoachForm ).nationality || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="address" placeholder="address"value={(form as CoachForm ).address || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="experience_years" placeholder="years of experience"value={(form as CoachForm ).experience_years || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="certifications" placeholder="certifications"value={(form as CoachForm ).certifications || ""} onChange={handleChange} required className="w-full border p-2 rounded" />  
            <input name="age" placeholder="age"value={(form as CoachForm ).age || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
          </>
        );

      case "coach":
        return (
          <>
            <label>Date of Birth:</label>
            <input  type="date"  name="date_of_birth" value={(form as CoachForm ).date_of_birth || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <label>Gender:</label>
            <select name="gender" value={(form as CoachForm ).gender || ""} onChange={handleChange} required  className="w-full border p-2 rounded" >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input name="nationality" placeholder="Nationality"value={(form as CoachForm ).nationality || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="address" placeholder="address"value={(form as CoachForm ).address || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="experience_years" placeholder="years of experience"value={(form as CoachForm ).experience_years || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="certifications" placeholder="certifications"value={(form as CoachForm ).certifications || ""} onChange={handleChange} required className="w-full border p-2 rounded" />  
            <input name="age" placeholder="age"value={(form as CoachForm ).age || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            
          </>
        );

      case "referee":
        return (
          <>
            <label>Date of Birth:</label>
            <input  type="date"  name="date_of_birth" value={(form as RefereeForm ).date_of_birth || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <label>Gender:</label>
            <select name="gender" value={(form as RefereeForm ).gender || ""} onChange={handleChange} required  className="w-full border p-2 rounded" >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input name="nationality" placeholder="Nationality"value={(form as RefereeForm ).nationality || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="address" placeholder="address"value={(form as RefereeForm ).address || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="experience_years" placeholder="years of experience"value={(form as RefereeForm ).experience_years || ""} onChange={handleChange} required  className="w-full border p-2 rounded" />
            <input name="certification_level" placeholder="certifications"value={(form as RefereeForm ).certification_level || ""} onChange={handleChange} required className="w-full border p-2 rounded" />  
            <input name="age" placeholder="age"value={(form as RefereeForm ).age || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
            <input name="matches_officiated" placeholder="matches_officiated"value={(form as RefereeForm ).matches_officiated || ""} onChange={handleChange} required className="w-full border p-2 rounded" />
          </>
        );

      default:
        return null;
    }
  };

  // ✅ UI
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Register - Phase 2 ({role})
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Submitting..." : "Finish Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}
