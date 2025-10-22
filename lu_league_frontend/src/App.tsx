// src/App.tsx (excerpt)

import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import DashboardLayout  from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import {Landing} from "./pages/home/Landing";
import PlayersPage from "./pages/players/PlayersPage";
import TeamsPage from "./pages/teams/TeamsPage";
import MatchesPage from "./pages/matches/MatchesPage";
import NewsPage from "./pages/news/NewsPage";
import StandingsPage from "./pages/standings/StandingsPage";


import LoginPage from "./pages/auth/LoginPage";

import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import CoachDashboard from "./pages/dashboard/CoachDashboard";
import PlayerDashboard from "./pages/dashboard/PlayerDashboard";
import RefereeDashboard from "./pages/dashboard/RefereeDashboard";
import RegisterPhase1 from "./pages/auth/RegisterPhase1";
import RegisterPhase2 from "./pages/auth/RegisterPhase2";
import UsersPage from "./pages/dashboard/admin/UsersPage";

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

        

<Route path="/dashboard/admin" element={
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
  path="/dashboard/referee"
  element={
    <ProtectedRoute role="referee">
      <DashboardLayout role="referee">
        <RefereeDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
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



        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
