
import { useProfile } from "@/hooks/auth/useProfile";
import { useSession } from "@/hooks/auth/useSession";
import { useAuthState } from "@/hooks/useAuthState";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAdminStatus() {
  const { user: authStateUser } = useAuthState();
  const { user: sessionUser } = useSession();
  const { data: profile, isLoading } = useProfile(sessionUser?.id);
  const [directIsAdmin, setDirectIsAdmin] = useState<boolean | null>(null);
  const [directIsApproved, setDirectIsApproved] = useState<boolean | null>(null);
  const [directIsMember, setDirectIsMember] = useState<boolean | null>(null);
  const [isCheckingDirectAdmin, setIsCheckingDirectAdmin] = useState(false);

  // Perform a direct DB check for admin status as a backup
  useEffect(() => {
    const checkDirectAdminStatus = async () => {
      try {
        setIsCheckingDirectAdmin(true);
        
        // First ensure we have a valid session
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session?.user?.id) {
          return;
        }
        
        const userId = sessionData.session.user.id;
        
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin, is_approved, is_member')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error("Error fetching direct admin status:", error);
          return;
        }
        
        if (data) {
          setDirectIsAdmin(!!data.is_admin);
          setDirectIsApproved(!!data.is_approved);
          setDirectIsMember(!!data.is_member);
          
          console.log("Direct DB admin status check:", {
            userId,
            isAdmin: !!data.is_admin,
            isApproved: !!data.is_approved,
            isMember: !!data.is_member,
            timestamp: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("Error in direct admin check:", err);
      } finally {
        setIsCheckingDirectAdmin(false);
      }
    };
    
    checkDirectAdminStatus();
  }, []);

  // Determine admin status from all sources
  const isAdmin = !!directIsAdmin || !!profile?.is_admin || !!authStateUser?.is_admin;
  const isApproved = !!directIsApproved || !!profile?.is_approved || !!authStateUser?.is_approved;
  const isMember = !!directIsMember || !!profile?.is_member || !!authStateUser?.is_member;
  
  // Updated: Consider both admin status, approved status, and member status for ability to manage events
  // Any user who is an admin, or is approved, or is a member can manage events
  const canManageEvents = isAdmin || isApproved || isMember;

  useEffect(() => {
    console.log('useAdminStatus - Final status:', {
      userId: authStateUser?.id || sessionUser?.id,
      authStateIsAdmin: !!authStateUser?.is_admin,
      profileIsAdmin: !!profile?.is_admin,
      directIsAdmin,
      effectiveIsAdmin: isAdmin,
      authStateIsApproved: !!authStateUser?.is_approved,
      profileIsApproved: !!profile?.is_approved,
      directIsApproved,
      effectiveIsApproved: isApproved,
      authStateIsMember: !!authStateUser?.is_member,
      profileIsMember: !!profile?.is_member,
      directIsMember,
      effectiveIsMember: isMember,
      effectiveCanManageEvents: canManageEvents,
      timestamp: new Date().toISOString()
    });
  }, [
    authStateUser?.id, sessionUser?.id, 
    authStateUser?.is_admin, profile?.is_admin, directIsAdmin, isAdmin,
    authStateUser?.is_approved, profile?.is_approved, directIsApproved, isApproved,
    authStateUser?.is_member, profile?.is_member, directIsMember, isMember,
    canManageEvents
  ]);

  return {
    isAdmin,
    canManageEvents,
    isLoading: isLoading || isCheckingDirectAdmin,
  };
}
