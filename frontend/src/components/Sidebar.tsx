import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.href = "/";
  };

  const navLinks = (
    <nav className="flex flex-col mt-4 gap-1 px-4">
      <NavLink
        to="/dashboard"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg font-medium transition-colors ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/tasks"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg font-medium transition-colors ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        Tasks
      </NavLink>
      <NavLink
        to="/profile"
        onClick={handleLinkClick}
        className={({ isActive }) =>
          `px-4 py-2 rounded-lg font-medium transition-colors ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`
        }
      >
        Profile
      </NavLink>
    </nav>
  );

  const logoutButton = (
    <div className="mt-auto px-4 py-4">
      <button onClick={() => handleLogout()} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden sticky top-0 lg:flex w-64 h-screen bg-white border-r shadow-sm flex-col">
        <h1 className="text-2xl font-bold px-6 py-4 border-b">CollabTask</h1>
        {navLinks}
        {logoutButton}
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-screen bg-white border-r shadow-sm flex flex-col z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <button
            onClick={handleLinkClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        {navLinks}
        {logoutButton}
      </div>
    </>
  );
}