import { Bell } from "lucide-react";

const Topbar = () => {
  return (
    <div className="h-16 bg-sky-100 shadow-sm flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-4">
        <Bell className="text-black-500 cursor-pointer" />
        <div className="w-10 h-10 rounded-full border-1 border-black bg-gray-300" />
      </div>
    </div>
  );
};

export default Topbar;
