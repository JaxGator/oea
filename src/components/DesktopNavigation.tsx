import { Link } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { UserMenu } from "./navigation/UserMenu";
import { SearchDialog } from "./search/SearchDialog";
import { createNavigationItems } from "@/utils/navigation";
import { supabase } from "@/integrations/supabase/client";

export function DesktopNavigation() {
  const { user, profile } = useAuthState();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navigationItems = createNavigationItems(user, profile, handleSignOut)
    .filter(item => !item.onClick && (!item.show || item.show(user, profile)))
    .filter(item => item.path !== '/auth' && item.path !== '#' && item.path !== '/' && item.path !== '/messages');

  return (
    <nav className="hidden md:block bg-gray-900 text-white p-4" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/">
            <img
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="Logo"
              className="h-12"
            />
          </Link>
          
          <div className="flex space-x-8" role="menubar">
            {navigationItems.map(({ label, path, external }) => 
              external ? (
                <a
                  key={path}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hover:text-primary-100 transition-colors ${path === '/members' ? 'text-[#FFD700]' : ''}`}
                  role="menuitem"
                  tabIndex={0}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={path}
                  to={path}
                  className={`hover:text-primary-100 transition-colors ${path === '/members' ? 'text-[#FFD700]' : ''}`}
                  role="menuitem"
                  tabIndex={0}
                >
                  {label}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <SearchDialog />
          <UserMenu user={user} profile={profile} />
        </div>
      </div>
      <link rel="robots" type="text/plain" href="/api/rest/v1/robots-txt" />
    </nav>
  );
}