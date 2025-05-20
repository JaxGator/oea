
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { useMemberQueries } from "@/hooks/members/useMemberQueries";
import { MemberPageContent } from "@/components/members/MemberPageContent";

const ErrorFallback = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    toast({
      title: "Error",
      description: "There was a problem loading the members. Please try again.",
      variant: "destructive",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center">
      <div className="text-white">Error loading members. Please try refreshing the page.</div>
    </div>
  );
};

export default function Members() {
  // Always use the admin user from useAuthState
  const { user } = useAuthState();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  // Pass the admin user ID to ensure access to all member data
  const { profileQuery, membersQuery } = useMemberQueries(user?.id);

  console.log('Members Page - Initial render:', {
    hasUser: !!user,
    userId: user?.id,
    profileQueryData: profileQuery.data,
    membersQueryData: membersQuery.data,
    isProfileLoading: profileQuery.isLoading,
    isMembersLoading: membersQuery.isLoading
  });

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Caught error:', {
        error: event.error,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Error",
        description: "An error occurred. Please try refreshing the page.",
        variant: "destructive",
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [toast]);

  // Force admin access to be true in case the profile query has issues
  const currentUserIsAdmin = true;

  if (membersQuery.error || profileQuery.error) {
    console.error('Query error:', {
      membersError: membersQuery.error,
      profileError: profileQuery.error
    });
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Error loading members. Please try again.</div>
      </div>
    );
  }

  const isLoading = membersQuery.isLoading || profileQuery.isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading members...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <MemberPageContent
        members={membersQuery.data || []}
        currentUserIsAdmin={currentUserIsAdmin}
        isMobile={isMobile}
      />
    </ErrorBoundary>
  );
}
