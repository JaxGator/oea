import { Home, Calendar, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function MobileNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
      <div className="flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center p-2 ${
            location.pathname === "/" ? "text-primary" : "text-gray-600"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/events"
          className={`flex flex-col items-center p-2 ${
            location.pathname === "/events" ? "text-primary" : "text-gray-600"
          }`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs mt-1">Events</span>
        </Link>
        <Link
          to="/about"
          className={`flex flex-col items-center p-2 ${
            location.pathname === "/about" ? "text-primary" : "text-gray-600"
          }`}
        >
          <Info className="w-6 h-6" />
          <span className="text-xs mt-1">About</span>
        </Link>
      </div>
    </nav>
  );
}