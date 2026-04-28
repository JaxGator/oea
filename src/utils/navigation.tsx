import { Info, Calendar, Users, Star, Mail, Shield, LucideIcon } from "lucide-react";
import { Profile } from "@/types/auth";
import { User } from "@supabase/supabase-js";

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
  external?: boolean;
  show?: (user: User | null, profile: Profile | null) => boolean;
  onClick?: () => void;
}

export const createNavigationItems = (user: User | null, profile: Profile | null, handleSignOut: () => void): NavigationItem[] => [
  {
    label: "Events",
    path: "/events",
    icon: Calendar,
  },
  {
    label: "Users",
    path: "/users",
    icon: Users,
    show: (_user: User | null, profile: Profile | null) => 
      !!_user && !!profile && (profile.is_admin || (profile.is_approved && profile.is_member)),
  },
  {
    label: "Messages",
    path: "/messages",
    icon: Mail,
    show: (_user: User | null, profile: Profile | null) => 
      !!_user && !!profile && (profile.is_admin || (profile.is_approved && profile.is_member)),
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
    show: (_user: User | null, profile: Profile | null) => 
      !!_user && !!profile && (profile.is_member || profile.is_admin),
  },
  {
    label: "Admin",
    path: "/admin",
    icon: Shield,
    show: (_user: User | null, profile: Profile | null) => 
      !!_user && profile?.is_admin === true,
  },
];
