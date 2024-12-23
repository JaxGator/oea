import { LucideIcon, Home, Calendar, BookOpen, Info, Users, ShoppingBag, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { Profile } from "@/types/auth";

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  path: string;
  external?: boolean;
  onClick?: () => void | Promise<void>;
  show?: (user: any, profile: Profile | null) => boolean;
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
    icon: BookOpen, 
    label: "Resources", 
    path: "/resources" 
  },
  { 
    icon: Users, 
    label: "Members", 
    path: "/members",
    show: (user) => !!user 
  },
  { 
    icon: Info, 
    label: "About", 
    path: "/about" 
  },
  {
    icon: ShoppingBag,
    label: "Store",
    path: "https://outdoorenergyadventures.printful.me/",
    external: true,
    show: (user) => !!user
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