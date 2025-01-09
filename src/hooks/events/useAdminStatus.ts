import { useProfile } from "@/hooks/auth/useProfile";
import { useSession } from "@/hooks/auth/useSession";

export function useAdminStatus() {
  const { user } = useSession();
  const { data: profile, isLoading } = useProfile(user?.id);

  return {
    isAdmin: !!profile?.is_admin,
    isLoading,
  };
}