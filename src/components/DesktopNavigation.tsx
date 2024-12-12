import { Home, Calendar, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function DesktopNavigation() {
  const location = useLocation();

  return (
    <nav className="hidden md:block bg-white border-b border-gray-200 px-4 py-3 animate-fade-in">
      <div className="flex justify-center items-center max-w-4xl mx-auto">
        <Link
          to="/"
          className={`flex items-center px-4 py-2 mx-2 transition-colors duration-200 ${
            location.pathname === "/" 
              ? "text-primary" 
              : "text-gray-600 hover:text-primary-400"
          }`}
        >
          <Home className="w-5 h-5 mr-2" />
          <span className="font-medium">Home</span>
        </Link>

        <Link
          to="/events"
          className={`flex items-center px-4 py-2 mx-2 transition-colors duration-200 ${
            location.pathname === "/events"
              ? "text-primary"
              : "text-gray-600 hover:text-primary-400"
          }`}
        >
          <Calendar className="w-5 h-5 mr-2" />
          <span className="font-medium">Events</span>
        </Link>

        <Link
          to="/about"
          className={`flex items-center px-4 py-2 mx-2 transition-colors duration-200 ${
            location.pathname === "/about"
              ? "text-primary"
              : "text-gray-600 hover:text-primary-400"
          }`}
        >
          <Info className="w-5 h-5 mr-2" />
          <span className="font-medium">About</span>
        </Link>
      </div>
    </nav>
  );
}