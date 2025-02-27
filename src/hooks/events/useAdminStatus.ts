
import { useProfile } from "@/hooks/auth/useProfile";
import { useSession } from "@/hooks/auth/useSession";

export function useAdminStatus() {
  const { user } = useSession();
  const { data: profile, isLoading } = useProfile(user?.id);

  console.log('useAdminStatus - User profile:', {
    userId: user?.id,
    isAdmin: profile?.is_admin,
    isApproved: profile?.is_approved,
    isMember: profile?.is_member,
    canManageEvents: (profile?.is_admin || (profile?.is_approved && profile?.is_member))
  });

  return {
    isAdmin: !!profile?.is_admin,
    canManageEvents: !!profile?.is_admin || (!!profile?.is_approved && !!profile?.is_member),
    isLoading,
  };
}
