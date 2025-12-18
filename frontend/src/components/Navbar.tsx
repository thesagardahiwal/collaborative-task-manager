import { useState, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  // Add other user properties if needed
}

interface NavbarProps {
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  notificationCount?: number;
}

export default function Navbar({ onMenuClick, onNotificationClick, notificationCount }: NavbarProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = '/';
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="h-16 bg-white border-b shadow-sm flex items-center justify-between px-4 lg:px-6 fixed left-0 lg:left-64 right-0 top-0 z-10">
      {/* Left side - Mobile menu button and title */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button - only visible on mobile */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        
        <h2 className="text-lg font-semibold text-gray-800"></h2>
      </div>

      {/* Right side - User profile */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onNotificationClick}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Bell className="w-5 h-5 text-gray-700" />

          {notificationCount !== undefined && notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white
      text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <div className="relative">
          {user ? (
            <>
              {/* Single user profile button - works for all screen sizes */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                aria-expanded={showDropdown}
                aria-label="User menu"
              >
                {/* User info - hidden on mobile (xs), visible on sm and up */}
                <div className="text-right hidden sm:block">
                  <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                  <p className="text-gray-500 text-xs truncate max-w-[150px]">{user.email}</p>
                </div>
                
                {/* User avatar - always visible */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {getInitials(user.name)}
                  </div>
                  {/* Chevron - hidden on mobile, visible on sm and up */}
                  <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                </div>
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <>
                  {/* Backdrop for mobile */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                  />
                  
                  {/* Dropdown content */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <Link to="/profile" onClick={() => setShowDropdown(false)} className="block mb-2 text-gray-800">
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-gray-500 text-sm truncate">{user.email}</p>
                      </Link>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 text-left text-red-600 hover:bg-red-50 transition-colors rounded-b-lg"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            // Fallback when no user data
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-sm hidden sm:block">Not logged in</span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}