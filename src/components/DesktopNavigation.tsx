import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LogOut, LogIn, UserCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function DesktopNavigation() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="hidden md:block bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="Logo"
              className="h-12"
            />
          </Link>
          <Link
            to="/events"
            className="hover:text-primary-100 transition-colors"
          >
            Events
          </Link>
          {user && (
            <Link
              to="/about"
              className="hover:text-primary-100 transition-colors"
            >
              About
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center hover:text-primary-100 transition-colors"
              >
                <UserCircle className="mr-2 h-5 w-5" />
                Profile
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-white hover:text-primary-100 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              variant="ghost"
              className="text-white hover:text-primary-100 transition-colors"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}