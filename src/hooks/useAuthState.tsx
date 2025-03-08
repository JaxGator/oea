
import { useSession } from "./auth/useSession";
import { useProfile } from "./auth/useProfile";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Profile } from "@/types/auth";

interface AuthState {
  user: Profile | null;
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export function useAuthState(): AuthState {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user: authUser, isLoading: isSessionLoading, error: sessionError } = useSession();
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useProfile(authUser?.id);
  
  // Create a complete mock admin profile that satisfies the Profile type
  const adminProfile: Profile = {
    id: authUser?.id || 'admin-user',
    username: 'admin',
    full_name: 'Administrator',
    avatar_url: null,
    email: authUser?.email || 'admin@example.com',
    is_admin: true,
    is_approved: true,
    is_member: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    event_reminders_enabled: true,
    email_notifications: true,
    in_app_notifications: true,
    interests: null,
    leaderboard_opt_out: false
  };
  
  // Log the override
  useEffect(() => {
    console.log("Auth state override applied - using admin profile:", adminProfile);
  }, []);

  // Force authenticated state to be true for all users
  return {
    user: adminProfile,
    profile: adminProfile,
    isLoading: false,
    error: null,
    isAuthenticated: true
  };
}
