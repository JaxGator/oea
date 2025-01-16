import { LucideIcon, Home, Calendar, BookOpen, Info, Users, LayoutDashboard, LogIn, LogOut, UserCircle } from "lucide-react";
import { Profile } from "@/types/auth";

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
  external?: boolean;
  onClick?: () => void | Promise<void>;
  show?: (user: any, profile: Profile | null) => boolean;
  className?: string;
}

export const createNavigationItems = (
  user: any, 
  profile: Profile | null,
  handleSignOut: () => Promise<void>
): NavigationItem[] => [
  { 
    icon: Home, 
    label: "Home", 
    path: "/" 
  },
  { 
    icon: Calendar, 
    label: "Events", 
    path: "/events" 
  },
  { 
    icon: Users, 
    label: "Users", 
    path: "/users",
    show: (user) => !!user 
  },
  { 
    icon: Info, 
    label: "About", 
    path: "/about" 
  },
  { 
    icon: BookOpen, 
    label: "Resources", 
    path: "/resources" 
  },
  {
    icon: UserCircle,
    label: "Members",
    path: "/members",
    show: (user, profile) => !!user && (profile?.is_member || profile?.is_admin),
    className: "text-[#FFD700] font-semibold"
  },
  {
    icon: LayoutDashboard,
    label: "Admin",
    path: "/admin",
    show: (user, profile) => !!user && profile?.is_admin
  },
  {
    icon: LogIn,
    label: "Sign In",
    path: "/auth",
    show: (user) => !user
  },
  {
    icon: LogOut,
    label: "Sign Out",
    path: "#",
    onClick: handleSignOut,
    show: (user) => !!user
  }
];