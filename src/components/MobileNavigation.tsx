import { Menu, LogIn, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Calendar, Info, Users, ShoppingBag, LayoutDashboard } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { SearchDialog } from "./search/SearchDialog";

export function MobileNavigation() {
  const location = useLocation();
  const { user, profile } = useAuthState();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navigationItems = [
    { icon: Home, label: "Home", path: "/", external: false },
    { icon: Calendar, label: "Events", path: "/events", external: false },
    ...(user ? [{ icon: Users, label: "Members", path: "/members", external: false }] : []),
    { icon: Info, label: "About", path: "/about", external: false },
    ...(profile?.is_admin ? [
      {
        icon: ShoppingBag,
        label: "Store",
        path: "https://outdoorenergyadventures.printful.me/",
        external: true,
      },
      { icon: LayoutDashboard, label: "Admin", path: "/admin", external: false }
    ] : []),
    ...(!user ? [{ icon: LogIn, label: "Sign In", path: "/auth", external: false }] : []),
    ...(user ? [{ 
      icon: LogOut, 
      label: "Sign Out", 
      path: "#",
      onClick: handleSignOut,
      external: false 
    }] : []),
  ];

  return (
    <div className="fixed bottom-4 right-4 md:hidden z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px] p-0">
          <div className="p-4">
            <SearchDialog />
          </div>
          <nav className="flex flex-col p-4">
            {navigationItems.map(({ icon: Icon, label, path, external, onClick }) => 
              external ? (
                <a
                  key={path}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </a>
              ) : onClick ? (
                <button
                  key={path}
                  onClick={onClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-primary/10 w-full text-left"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ) : (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    location.pathname === path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              )
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}