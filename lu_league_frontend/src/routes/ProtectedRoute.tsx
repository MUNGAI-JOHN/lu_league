// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext"; // ✅ Ensure casing matches file name
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  role?: "admin" | "coach" | "player" | "referee";
}

export default function ProtectedRoute({ children, role }: Props) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // ✅ 1. If not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ 2. If logged in but wrong role → redirect to home or their dashboard
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ 3. Otherwise → render protected page
  return <>{children}</>;
}
