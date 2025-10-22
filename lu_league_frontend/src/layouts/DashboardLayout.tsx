// src/layouts/DashboardLayout.tsx
import type { ReactNode } from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import { Outlet } from "react-router-dom";

interface DashboardLayoutProps {
  children?: ReactNode;
  role: "admin" | "coach" | "player" | "referee"; // required
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={role} /> {/* TypeScript is happy */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        <Outlet/>
      </div>
    </div>
  );
};


export default DashboardLayout;
