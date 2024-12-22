import { Link } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { StoreLink } from "./navigation/StoreLink";
import { UserMenu } from "./navigation/UserMenu";
import { SearchDialog } from "./search/SearchDialog";

const NAV_LINKS = [
  { to: "/events", label: "Events" },
  { to: "/resources", label: "Resources" },
  { to: "/about", label: "About" },
];

const STORE_LINK = {
  href: "https://outdoorenergyadventures.printful.me/",
  label: "Store",
};

export function DesktopNavigation() {
  const { user, profile } = useAuthState();

  return (
    <nav className="hidden md:block bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="Logo"
              className="h-12"
            />
          </Link>
          <NavigationLinks links={NAV_LINKS} user={user} />

          {user && profile?.is_admin && (
            <>
              <StoreLink href={STORE_LINK.href} label={STORE_LINK.label} />
              <Link
                to="/admin"
                className="hover:text-primary-100 transition-colors"
              >
                Admin
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <SearchDialog />
          <UserMenu user={user} profile={profile} />
        </div>
      </div>
    </nav>
  );
}