import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { LogOut, LogIn } from "lucide-react";
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
                className="hover:text-[#0d97d1] transition-colors"
              >
                Events
              </Link>
              <Link
                to="/about"
                className="hover:text-[#0d97d1] transition-colors"
              >
                About
              </Link>
            </>
          )}
        </div>
        {user ? (
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-white hover:text-[#0d97d1] transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/auth")}
            variant="ghost"
            className="text-white hover:text-[#0d97d1] transition-colors"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        )}
      </div>
    </nav>
  );
}