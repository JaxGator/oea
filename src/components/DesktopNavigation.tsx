import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { createNavigationItems } from "@/utils/navigation";
import { UserMenu } from "@/components/navigation/UserMenu";

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
    .filter(item => item.path !== '/auth' && item.path !== '#');

  return (
    <nav className="hidden md:block bg-gray-900 text-white p-4" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-bold text-white hover:text-primary-100 transition-colors"
            role="menuitem"
          >
            <img 
              src="/lovable-uploads/609edf01-3169-439a-80f5-f6f15de7a5a6.png"
              alt="OEA Logo"
              className="h-12 w-auto"
            />
          </Link>
          
          <div className="flex-1 flex items-center justify-center space-x-8 ml-8">
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
          
          <div className="flex-none">
            <UserMenu user={user} profile={profile} />
          </div>
        </div>
      </div>
    </nav>
  );
}