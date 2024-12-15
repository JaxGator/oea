import { Home, Calendar, Info, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function MobileNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-50 animate-fade-in">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 transition-colors duration-200 ${
            location.pathname === "/" 
              ? "text-primary" 
              : "text-gray-600 hover:text-[#0d97d1]"
          }`}
        >
          <div className="relative">
            <Home className="w-6 h-6" />
            {location.pathname === "/" && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </div>
          <span className="text-xs mt-1 font-medium">Home</span>
        </Link>

        <Link
          to="/events"
          className={`flex flex-col items-center p-2 transition-colors duration-200 ${
            location.pathname === "/events"
              ? "text-primary"
              : "text-gray-600 hover:text-[#0d97d1]"
          }`}
        >
          <div className="relative">
            <Calendar className="w-6 h-6" />
            {location.pathname === "/events" && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </div>
          <span className="text-xs mt-1 font-medium">Events</span>
        </Link>

        <Link
          to="/members"
          className={`flex flex-col items-center p-2 transition-colors duration-200 ${
            location.pathname === "/members"
              ? "text-primary"
              : "text-gray-600 hover:text-[#0d97d1]"
          }`}
        >
          <div className="relative">
            <Users className="w-6 h-6" />
            {location.pathname === "/members" && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </div>
          <span className="text-xs mt-1 font-medium">Members</span>
        </Link>

        <Link
          to="/about"
          className={`flex flex-col items-center p-2 transition-colors duration-200 ${
            location.pathname === "/about"
              ? "text-primary"
              : "text-gray-600 hover:text-[#0d97d1]"
          }`}
        >
          <div className="relative">
            <Info className="w-6 h-6" />
            {location.pathname === "/about" && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </div>
          <span className="text-xs mt-1 font-medium">About</span>
        </Link>
      </div>
    </nav>
  );
}