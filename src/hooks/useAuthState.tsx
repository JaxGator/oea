import { useSession } from "./auth/useSession";
import { useProfile } from "./auth/useProfile";

export function useAuthState() {
  const { user, isLoading: isSessionLoading, error: sessionError } = useSession();
  const { profile, isLoading: isProfileLoading, error: profileError } = useProfile(user?.id);

  return {
    user,
    profile,
    isLoading: isSessionLoading || isProfileLoading,
    error: sessionError || profileError
  };
}