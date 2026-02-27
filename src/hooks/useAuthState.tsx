
import { useSession } from "./auth/useSession";
import { useProfile } from "./auth/useProfile";
import { useToast } from "@/hooks/use-toast";
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
  const { user: authUser, isLoading: isSessionLoading, error: sessionError } = useSession();
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useProfile(authUser?.id);

  return {
    user: (profile as Profile) || null,
    profile: (profile as Profile) || null,
    isLoading: isSessionLoading || isProfileLoading,
    error: sessionError || profileError || null,
    isAuthenticated: !!authUser && !!profile
  };
}
