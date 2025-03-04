
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EventFormProps } from "../EventFormTypes";
import { useAuthState } from "@/hooks/useAuthState";
import { EventFormContent } from "./EventFormContent";

export function EventFormWrapper({ 
  onSuccess, 
  initialData, 
  isPastEvent, 
  isWixEvent,
  forceAdmin,
  forceCanManage
}: EventFormProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthState();
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [sessionConfirmed, setSessionConfirmed] = useState(false);
  const [hasPermissionToEdit, setHasPermissionToEdit] = useState(true);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  
  // Direct session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        setVerifyingSession(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          return;
        }
        
        const hasSession = !!data.session;
        const userId = data.session?.user?.id || null;
        
        setSessionConfirmed(hasSession);
        setSessionUserId(userId);
        
        console.log("EventForm - Direct session check:", {
          hasSession,
          userId,
          timestamp: new Date().toISOString()
        });
        
        // If we have a session and user appears to be admin, confirm admin status
        if (hasSession && userId && (user?.is_admin || forceAdmin)) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('is_admin, is_approved')
            .eq('id', userId)
            .single();
            
          console.log("Admin status confirmation:", {
            directCheck: profileData?.is_admin,
            userObject: user?.is_admin,
            forceAdmin
          });
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setVerifyingSession(false);
      }
    };
    
    checkSession();
  }, [user?.is_admin, user?.id, forceAdmin]);
  
  // Log authentication status for debugging
  useEffect(() => {
    console.log('EventForm - Auth status:', {
      isAuthenticated,
      userId: user?.id,
      sessionUserId,
      isAdmin: user?.is_admin,
      isApproved: user?.is_approved,
      sessionConfirmed,
      verifyingSession,
      authLoading,
      forceAdmin,
      forceCanManage
    });
  }, [user, isAuthenticated, sessionConfirmed, verifyingSession, authLoading, forceAdmin, forceCanManage, sessionUserId]);

  // Check permissions for editing events
  useEffect(() => {
    if (initialData?.id && (user?.id || sessionUserId)) {
      const effectiveUserId = user?.id || sessionUserId;
      const isCreator = initialData.created_by === effectiveUserId;
      const isAdmin = (user?.is_admin || false) || (forceAdmin || false);
      const canManageEvents = isAdmin || (user?.is_approved || false) || (forceCanManage || false);
      const canEdit = isAdmin || canManageEvents || isCreator;
      
      console.log("Permission check in EventFormWrapper:", {
        userId: effectiveUserId,
        eventCreator: initialData.created_by,
        isAdmin,
        forceAdmin,
        canManageEvents,
        forceCanManage,
        isCreator,
        canEdit
      });
      
      setHasPermissionToEdit(canEdit);
      
      if (!canEdit) {
        console.warn("User does not have permission to edit this event", {
          userId: effectiveUserId,
          eventCreator: initialData.created_by,
          isAdmin,
          canManageEvents
        });
      }
    }
  }, [initialData, user, forceAdmin, forceCanManage, sessionUserId]);

  // Loading state while verifying session
  if (verifyingSession || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500">Verifying your session...</p>
      </div>
    );
  }

  // Authentication warning state
  if (!isAuthenticated && !sessionConfirmed) {
    return (
      <Alert className="border-red-500 text-red-800 bg-red-50">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to create or edit events. Please sign in and try again.
        </AlertDescription>
      </Alert>
    );
  }

  // Show permission warning for edit operations
  const showPermissionWarning = initialData?.id && !hasPermissionToEdit;

  if (showPermissionWarning) {
    return (
      <Alert className="border-yellow-500 text-yellow-800 bg-yellow-50">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          You do not have permission to edit this event. Only the event creator, administrators, 
          or approved members can make changes.
        </AlertDescription>
      </Alert>
    );
  }

  // Use either the user from useAuthState or the session user ID
  const effectiveUser = user || (sessionUserId ? { id: sessionUserId } as any : null);

  return (
    <EventFormContent
      onSuccess={onSuccess}
      initialData={initialData}
      isPastEvent={isPastEvent}
      isWixEvent={isWixEvent}
      hasPermissionToEdit={hasPermissionToEdit}
      user={effectiveUser}
      forceAdmin={forceAdmin}
      forceCanManage={forceCanManage}
    />
  );
}
