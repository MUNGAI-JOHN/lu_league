// src/components/common/Footer.tsx
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} LU League. All rights reserved.</p>

        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="/standings" className="hover:text-black">Standings</Link>
          <Link to="/teams" className="hover:text-white">Teams</Link>
          <Link to="/players" className="hover:text-white">Players</Link>
          <Link to="/matches" className="hover:text-white">Matches</Link>
          <Link to="/news" className="hover:text-white">News</Link>
        </div>
      </div>
    </footer>
  );
};
