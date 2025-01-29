import { Info, Calendar, Users } from "lucide-react";
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
    label: "Events",
    path: "/events",
    icon: Calendar,
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
    show: (user: any, profile: Profile | null) => profile?.is_admin === true,
  },
  {
    label: "Resources",
    path: "/resources",
    icon: Info,
  },
  {
    label: "About",
    path: "/about",
    icon: Info,
  },
];