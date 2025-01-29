import { Home, Info, Calendar, Users, Store, Settings, LogOut, MessageSquare, User2 } from "lucide-react";
import { Profile } from "@/types/auth";

interface NavigationItem {
  label: string;
  path: string;
  icon: any;
  external?: boolean;
  show?: (user: any, profile: Profile | null) => boolean;
  onClick?: () => void;
}

export const createNavigationItems = (user: any, profile: Profile | null, handleSignOut: () => void): NavigationItem[] => [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "About",
    path: "/about",
    icon: Info,
  },
  {
    label: "Events",
    path: "/events",
    icon: Calendar,
  },
  {
    label: "Members",
    path: "/members",
    icon: Users,
    show: (user: any) => !!user,
  },
  {
    label: "Messages",
    path: "/messages",
    icon: MessageSquare,
    show: (user: any) => !!user,
  },
  {
    label: "Store",
    path: "/store",
    icon: Store,
    show: (user: any) => !!user,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User2,
    show: (user: any) => !!user,
  },
  {
    label: "Admin",
    path: "/admin",
    icon: Settings,
    show: (user: any, profile: Profile | null) => profile?.is_admin,
  },
  {
    label: "Sign Out",
    path: "#",
    icon: LogOut,
    show: (user: any) => !!user,
    onClick: handleSignOut,
  },
];