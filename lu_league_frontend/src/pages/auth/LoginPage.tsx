import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // if user was redirected here from a protected route
  const from = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


//this in where now am connecting my backend api for login    
//"http://localhost:5000/api/auth/login

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

    //this checks if the data given matches with the data in the backend   
      if (!res.ok) {
        setError(data.message || "Login Failed");
        setLoading(false);
        return;
      }

      // expected: { token, user: { role: "admin" | "coach" | "referee" | "player" } }
      login(data.token, data.user);

      // Redirect logic
      if (from) {
        navigate(from, { replace: true });
        return;
      }
//this now helps to login the right user to his/her dashboard after token verification is done 
const role = data.user?.role;
const phase2 = data.user?.phase2_completed;

console.log("User data:", data.user);
console.log("Phase 2 completed:", data.user?.phase2_completed);
console.log("Role:", data.user?.role);


// 🚦 Handle Phase 2 redirection
// 🚦 Handle Phase 2 redirection

// ✅ If admin → skip phase 2
      if (role === "admin") {
        navigate("/dashboard/admin");
        return;
      }
if (!phase2) {
  navigate(`/register-phase2?token=${data.token}`);
  return;
  }
  console.log("Token being passed to Phase 2 page:", data.token);

// ✅ Otherwise, go to dashboards
switch (role) {
  case "coach":
    navigate("/dashboard/coach");
    break;
  case "referee":
    navigate("/dashboard/referee");
    break;
  case "player":
    navigate("/dashboard/player");
    break;
  default:
    navigate("/"); // fallback to home page
}

  
      
    //this now displays error of backend eg run your backend server or db issues 
    } catch (err) {
      console.error(err);
      console.error("Login error:", err);
      setError("Server error, please try again later");
    } finally {
      setLoading(false);
    }
  };
//this now returns that loginform for inputs
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
