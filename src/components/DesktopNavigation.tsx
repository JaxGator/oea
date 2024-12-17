import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { useCallback } from "react";

// Reusable Navigation Links
const NAV_LINKS = [
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
];

const STORE_LINK = {
  href: "https://outdoorenergyadventures.printful.me/",
  label: "Store",
};

// Component for rendering navigation links
function NavigationLinks({ links, user }: { links: { to: string; label: string }[], user: any }) {
  return (
    <ul className="flex space-x-8">
      {links.map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            className="hover:text-primary-100 transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
      {user && (
        <li>
          <Link
            to="/members"
            className="hover:text-primary-100 transition-colors"
          >
            Members
          </Link>
        </li>
      )}
    </ul>
  );
}

// Store Link Component
function StoreLink() {
  return (
    <a
      href={STORE_LINK.href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-primary-100 transition-colors"
    >
      {STORE_LINK.label}
    </a>
  );
}

// Main Desktop Navigation Component
export function DesktopNavigation() {
  const { user, profile } = useAuthState();

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <nav className="hidden md:block bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="Logo"
              className="h-12"
            />
          </Link>
          <NavigationLinks links={NAV_LINKS} user={user} />

          {/* Conditional Links */}
          {user && (
            <>
              {(profile?.is_admin || profile?.is_member) && <StoreLink />}
              {profile?.is_admin && (
                <Link
                  to="/admin"
                  className="hover:text-primary-100 transition-colors"
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* User Profile and Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:opacity-80"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={profile?.avatar_url}
                    alt={
                      profile?.full_name ||
                      profile?.username ||
                      "User Avatar"
                    }
                  />
                  <AvatarFallback>
                    <UserCircle className="h-8 w-8 text-[#0d97d1]" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {profile?.full_name || profile?.username}
                </span>
              </Link>
              <Button
                variant="ghost"
                className="text-white hover:text-primary-100"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button
                variant="ghost"
                className="text-white hover:text-primary-100"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}