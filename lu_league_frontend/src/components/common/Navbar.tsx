import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button  from "../ui/button"; // Shadcn UI button
import { Menu } from "lucide-react"; // optional hamburger icon

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Standings", path: "/standings" },
    { name: "Teams", path: "/teams" },
    { name: "Players", path: "/players" },
    { name: "Matches", path: "/matches" },
    { name: "News", path: "/news" },
    { name: "cloudinary", path: "/cloudinary"},
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            LU League
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-500"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setOpen(!open)}>
              <Menu />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block px-3 py-2 text-blue-600 font-semibold"
                    : "block px-3 py-2 text-gray-700 hover:text-blue-500"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
