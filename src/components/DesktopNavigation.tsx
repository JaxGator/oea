import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";

export function DesktopNavigation() {
  const { user } = useAuthState();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="hidden md:block bg-[#222222] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="Logo"
              className="h-12"
            />
          </Link>
          {user && (
            <>
              <Link
                to="/events"
                className="hover:text-primary-100 transition-colors"
              >
                Events
              </Link>
              <Link
                to="/members"
                className="hover:text-primary-100 transition-colors"
              >
                Members
              </Link>
              <Link
                to="/about"
                className="hover:text-primary-100 transition-colors"
              >
                About
              </Link>
            </>
          )}
        </div>
        {user && (
          <Button
            variant="ghost"
            className="text-white hover:text-primary-100"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        )}
      </div>
    </nav>
  );
}