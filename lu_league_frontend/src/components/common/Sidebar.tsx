// src/components/common/Sidebar.tsx
import {
  Home,
  Users,
  Trophy,
  Shield,
  UserCog,
  UserCheck,
  Scale,
  Bell,
  BarChart,
  Settings,
  LogOut,
  ClipboardList,
  Dumbbell,
  Calendar,
  MessageSquare,
  LineChart,
  Watch,
  Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  role: "admin" | "coach" | "referee" | "player";
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  roles: SidebarProps["role"][];
}

// ✅ ALL NAVIGATION ITEMS (grouped by roles)
const navItems: NavItem[] = [
  // Common to all roles
  { label: "Dashboard", icon: Home, path: "/dashboard/home", roles: ["admin", "coach", "referee", "player"] },

  // ADMIN DASHBOARD
  { label: "Users", icon: Users, path: "/dashboard/admin/users", roles: ["admin"] },
  { label: "Matches", icon: Trophy, path: "/dashboard/admin/matches", roles: ["admin"] },
  { label: "Teams", icon: Shield, path: "/dashboard/admin/teams", roles: ["admin"] },
  { label: "Coaches", icon: UserCog, path: "/dashboard/admin/coaches", roles: ["admin"] },
  { label: "Players", icon: UserCheck, path: "/dashboard/admin/players", roles: ["admin"] },
  { label: "Referees", icon: Scale, path: "/dashboard/admin/referees", roles: ["admin"] },
  { label: "News", icon: Newspaper, path: "/dashboard/admin/news", roles: ["admin"] },
  { label: "Announcements", icon: Bell, path: "/dashboard/admin/announcements", roles: ["admin"] },
  { label: "Reports", icon: BarChart, path: "/dashboard/admin/reports", roles: ["admin"] },
  { label: "Settings", icon: Settings, path: "/dashboard/admin/settings", roles: ["admin"] },

  // COACH DASHBOARD
  { label: "Team", icon: Users, path: "/dashboard/coach/team", roles: ["coach"] },
  { label: "Player Performance", icon: LineChart, path: "/dashboard/coach/performance", roles: ["coach"] },
  { label: "Training", icon: Dumbbell, path: "/dashboard/coach/training", roles: ["coach"] },
  { label: "Schedule", icon: Calendar, path: "/dashboard/coach/schedule", roles: ["coach"] },
  { label: "Notifications", icon: Bell, path: "/dashboard/coach/notifications", roles: ["coach"] },
  { label: "Settings", icon: Settings, path: "/dashboard/coach/settings", roles: ["coach"] },

  // PLAYER DASHBOARD
  { label: "My Performance", icon: BarChart, path: "/dashboard/player/performance", roles: ["player"] },
  { label: "Training", icon: Dumbbell, path: "/dashboard/player/training", roles: ["player"] },
  { label: "Matches", icon: Trophy, path: "/dashboard/player/matches", roles: ["player"] },
  { label: "Messages", icon: MessageSquare, path: "/dashboard/player/messages", roles: ["player"] },
  { label: "Calendar", icon: Calendar, path: "/dashboard/player/calendar", roles: ["player"] },
  { label: "Settings", icon: Settings, path: "/dashboard/player/settings", roles: ["player"] },

  // REFEREE DASHBOARD
  { label: "My Matches", icon: Trophy, path: "/dashboard/referee/matches", roles: ["referee"] },
  { label: "Match Reports", icon: ClipboardList, path: "/dashboard/referee/reports", roles: ["referee"] },
  { label: "Assignments", icon: Watch, path: "/dashboard/referee/assignments", roles: ["referee"] },
  { label: "Performance Review", icon: Scale, path: "/dashboard/referee/review", roles: ["referee"] },
  { label: "Messages", icon: MessageSquare, path: "/dashboard/referee/messages", roles: ["referee"] },
  { label: "Settings", icon: Settings, path: "/dashboard/referee/settings", roles: ["referee"] },
];

const Sidebar = ({ role, onLogout }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sky-700 text-white flex flex-col justify-between min-h-screen p-4">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold mb-6 tracking-wide">LU League</h2>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-2">
          {navItems
            .filter((item) => item.roles.includes(role))
            .map(({ label, icon: Icon, path }) => (
              <Link
                key={label}
                to={path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-sky-600 transition-colors",
                  location.pathname === path && "bg-sky-600"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
        </nav>
      </div>

      {/* LOGOUT SECTION */}
      <div className="mt-8 border-t border-sky-500 pt-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-md bg-black hover:bg-sky-600 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
