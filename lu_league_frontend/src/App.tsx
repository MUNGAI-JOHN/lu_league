// src/App.tsx (excerpt)

import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./layouts/DashboardLayout";
import { MainLayout } from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import { Landing } from "./pages/home/Landing";
import MatchesPage from "./pages/matches/MatchesPage";
import NewsPage from "./pages/news/NewsPage";
import PlayersPage from "./pages/players/PlayersPage";
import StandingsPage from "./pages/standings/StandingsPage";
import TeamsPage from "./pages/teams/TeamsPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPhase1 from "./pages/auth/RegisterPhase1";
import RegisterPhase2 from "./pages/auth/RegisterPhase2";

import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import PlayerAdminPage from "./pages/dashboard/admin/PlayerAdminPage";
import RefereeAdminPage from "./pages/dashboard/admin/RefereeAdminPage";
import TeamsAdminPage from "./pages/dashboard/admin/TeamsAdminPage";
import UsersPage from "./pages/dashboard/admin/UsersPage";

import NewsCoachPage from "@/pages/dashboard/coach/NewsCoachPage";
import CoachesAdminPage from "./pages/dashboard/admin/CoachAdminPage";
import CoachCoachPage from "./pages/dashboard/coach/CoachCoachPage";
import PlayerCoachPage from "./pages/dashboard/coach/PlayerCoachPage";
import TeamsCoachPage from "./pages/dashboard/coach/TeamsCoachPage";

import NewsAdminPage from "./pages/dashboard/admin/NewsAdminPage";
import CoachDashboard from "./pages/dashboard/coach/CoachDashboard";
import PlayerDashboard from "./pages/dashboard/player/PlayerDashboard";
import PlayerPlayerPage from "./pages/dashboard/player/PlayerPlayerPage";
import RefereeDashboard from "./pages/dashboard/RefereeDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPhase1 />} />
        <Route path="/register-phase2" element={<RegisterPhase2 />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin">
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/users"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin">
                <UsersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/teams"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin">
                <TeamsAdminPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/coaches"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin">
                <CoachesAdminPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/players"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin">
                <PlayerAdminPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/referees"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin">
                <RefereeAdminPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/news"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout role="admin">
                <NewsAdminPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* COACH ROUTES */}

        <Route
          path="/dashboard/coach"
          element={
            <ProtectedRoute role="coach">
              <DashboardLayout role="coach">
                <CoachDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/coach/team"
          element={
            <ProtectedRoute role="coach">
              <DashboardLayout role="coach">
                <TeamsCoachPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/coach/players"
          element={
            <ProtectedRoute role="coach">
              <DashboardLayout role="coach">
                <PlayerCoachPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/coach/coaches"
          element={
            <ProtectedRoute role="coach">
              <DashboardLayout role="coach">
                <CoachCoachPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/coach/news"
          element={
            <ProtectedRoute role="coach">
              <DashboardLayout role="coach">
                <NewsCoachPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* REFEREE ROUTES */}
        <Route
          path="/dashboard/referee"
          element={
            <ProtectedRoute role="referee">
              <DashboardLayout role="referee">
                <RefereeDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* PLAYER ROUTES */}

        <Route
          path="/dashboard/player"
          element={
            <ProtectedRoute role="player">
              <DashboardLayout role="player">
                <PlayerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/player/players"
          element={
            <ProtectedRoute role="player">
              <DashboardLayout role="player">
                <PlayerPlayerPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
