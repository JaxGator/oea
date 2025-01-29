import { Info, Calendar, Users, Star, Mail, Shield } from "lucide-react";
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
    show: (user: any, profile: Profile | null) => 
      !!user && profile && (profile.is_admin || (profile.is_approved && profile.is_member)),
  },
  {
    label: "Messages",
    path: "/messages",
    icon: Mail,
    show: (user: any, profile: Profile | null) => 
      !!user && profile && (profile.is_admin || (profile.is_approved && profile.is_member)),
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
  {
    label: "Members",
    path: "/members",
    icon: Star,
    show: (user: any, profile: Profile | null) => 
      !!user && profile && (profile.is_member || profile.is_admin),
  },
  {
    label: "Admin",
    path: "/admin",
    icon: Shield,
    show: (user: any, profile: Profile | null) => 
      !!user && profile?.is_admin === true,
  },
];