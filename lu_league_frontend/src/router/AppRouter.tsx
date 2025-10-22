// src/router/AppRouter.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "../pages/home/Landing";
import  LoginAdmin  from "../pages/auth/LoginAdmin";
import LoginCoach  from "../pages/auth/LoginCoach";
import  LoginReferee  from "../pages/auth/LoginReferee";
import  StandingsPage  from "../pages/standings/StandingsPage";
import  TeamsPage  from "../pages/teams/TeamsPage";
import  PlayersPage from "../pages/players/PlayersPage";
import  MatchesPage from "../pages/matches/MatchesPage";
import NewsPage  from "../pages/news/NewsPage";

import { MainLayout } from "../layouts/MainLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/news" element={<NewsPage />} />
        </Route>

        {/* Auth routes (login pages) */}
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/coach" element={<LoginCoach />} />
        <Route path="/login/referee" element={<LoginReferee />} />
        <Route path="/login/player" element={<LoginReferee />} />


        {/* Dashboard routes (protected) */}
        <Route path="/dashboard/*" element={<DashboardLayout />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};
