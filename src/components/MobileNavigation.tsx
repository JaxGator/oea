import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Calendar, Info, Users, ShoppingBag } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";

export function MobileNavigation() {
  const location = useLocation();
  const { profile } = useAuthState();

  const navigationItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Users, label: "Members", path: "/members" },
    { icon: Info, label: "About", path: "/about" },
    ...(profile?.is_admin ? [{ icon: ShoppingBag, label: "Store", path: "/store" }] : []),
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
          <nav className="flex flex-col p-4">
            {navigationItems.map(({ icon: Icon, label, path }) => (
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
              {item.external ? </a> : </Link>}
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
