import { Home, Calendar, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DesktopNavigation() {
  const location = useLocation();

  return (
    <nav className="hidden md:block bg-black border-b border-gray-800 px-4 py-3 animate-fade-in">
      <div className="flex justify-center items-center max-w-4xl mx-auto">
        <Link
          to="/"
          className={`flex items-center px-4 py-2 mx-2 transition-colors duration-200 ${
            location.pathname === "/" 
              ? "text-[#0d97d1]" 
              : "text-white hover:text-[#0d97d1]"
          }`}
        >
          <Home className="w-5 h-5 mr-2" />
          <span className="font-medium">Home</span>
        </Link>

        <Link
          to="/events"
          className={`flex items-center px-4 py-2 mx-2 transition-colors duration-200 ${
            location.pathname === "/events"
              ? "text-[#0d97d1]"
              : "text-white hover:text-[#0d97d1]"
          }`}
        >
          <Calendar className="w-5 h-5 mr-2" />
          <span className="font-medium">Events</span>
        </Link>

        <Link
          to="/about"
          className={`flex items-center px-4 py-2 mx-2 transition-colors duration-200 ${
            location.pathname === "/about"
              ? "text-[#0d97d1]"
              : "text-white hover:text-[#0d97d1]"
          }`}
        >
          <Info className="w-5 h-5 mr-2" />
          <span className="font-medium">About</span>
        </Link>
      </div>
    </nav>
  );
}