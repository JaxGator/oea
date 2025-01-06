import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { createNavigationItems } from "@/utils/navigation";

interface DesktopNavigationProps {
  user: User | null;
  profile: Profile | null;
}

export function DesktopNavigation({ user, profile }: DesktopNavigationProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navigationItems = createNavigationItems(user, profile, handleSignOut)
    .filter(item => !item.onClick && (!item.show || item.show(user, profile)))
    .filter(item => item.path !== '/auth' && item.path !== '#' && item.path !== '/');

  return (
    <nav className="hidden md:block bg-gray-900 text-white p-4" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-xl font-bold text-white hover:text-primary-100 transition-colors"
            role="menuitem"
          >
            OEA
          </Link>
          
          <div className="flex space-x-8" role="menubar">
            {navigationItems.map(({ label, path, external }) => 
              external ? (
                <a
                  key={path}
                  href={path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-100 transition-colors"
                  role="menuitem"
                  tabIndex={0}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={path}
                  to={path}
                  className="hover:text-primary-100 transition-colors"
                  role="menuitem"
                  tabIndex={0}
                >
                  {label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}