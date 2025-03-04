
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { EventFormValues } from '@/components/event/EventFormTypes';
import { validateEventData, cleanEventData } from '@/utils/eventValidation';
import { createEvent, updateEvent } from '@/services/events/eventDatabaseService';
import { useAuthState } from '@/hooks/useAuthState';
import { supabase } from '@/integrations/supabase/client';

export function useEventFormSubmit(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuthState();
  const [checkedAuth, setCheckedAuth] = useState(false);
  
  // Additional auth check to ensure we have the latest state
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const isAuthVerified = !!data.session;
        
        console.log('useEventFormSubmit - Auth verification:', {
          sessionExists: isAuthVerified,
          sessionUserId: data.session?.user?.id,
          timestamp: new Date().toISOString()
        });
        
        setCheckedAuth(true);
      } catch (err) {
        console.error('Auth verification error:', err);
      }
    };
    
    verifyAuth();
  }, []);
  
  const handleSubmit = async (formData: EventFormValues, initialData?: any) => {
    try {
      console.log('Event form submission starting with auth state:', {
        isAuthenticated,
        userId: user?.id,
        isAdmin: user?.is_admin,
        isApproved: user?.is_approved,
        isMember: user?.is_member,
        isLoading,
        checkedAuth,
        timestamp: new Date().toISOString()
      });
      
      setIsSubmitting(true);
      
      // Perform a direct auth check here to be extra sure
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error('Authentication verification failed: No active session');
        toast.error('You must be logged in to save events. Please sign in again.');
        throw new Error('No active session');
      }
      
      // Get the user ID from either the current user or the session
      const userId = user?.id || sessionData.session?.user?.id;
      
      if (!userId) {
        console.error('Authentication failed: No user ID available', { 
          isAuthenticated, 
          user,
          sessionUserId: sessionData.session?.user?.id
        });
        toast.error('Unable to identify your account. Please try logging in again.');
        throw new Error('No user ID available');
      }
      
      // Check if user is admin or member - admins and members always have permission
      const isAdmin = user?.is_admin || false;
      const isApproved = user?.is_approved || false;
      const isMember = user?.is_member || false;
      
      console.log('Authentication verified:', { 
        isAuthenticated, 
        userId,
        isAdmin,
        isApproved,
        isMember,
        actionType: initialData?.id ? 'update' : 'create',
        sessionUserId: sessionData.session?.user?.id
      });
      
      // Clean and validate data
      validateEventData(formData);
      const cleanedData = cleanEventData(formData);
      
      // Ensure created_by is set properly for new events
      if (!initialData?.id && !cleanedData.created_by) {
        cleanedData.created_by = userId;
      }
      
      console.log('Processing event submission with data:', {
        ...cleanedData,
        created_by: cleanedData.created_by || userId
      });
      
      let result;
      
      // Check if this is an update or create operation
      if (initialData?.id) {
        // This is an update operation
        // CRITICAL FIX: ALWAYS bypass permission checks for admins and members
        // Don't even check permissions for admins or members
        const isAdminOrMember = isAdmin || isMember || isApproved;
        
        if (isAdminOrMember) {
          console.log('Admin or member detected, BYPASSING ALL permission checks:', {
            userId,
            isAdmin,
            isMember,
            isApproved,
            eventId: initialData.id
          });
          
          // Preserve the original created_by field for updates
          if (initialData.created_by) {
            cleanedData.created_by = initialData.created_by;
          }
          
          result = await updateEvent(initialData.id, cleanedData);
        } else {
          // Regular user - only check if they are the creator
          const hasPermission = initialData.created_by === userId;
          
          console.log('Permission check for regular user:', {
            userId,
            eventCreator: initialData.created_by,
            hasPermission
          });
          
          if (!hasPermission) {
            console.error('Permission denied: user cannot edit this event', {
              userId,
              eventCreator: initialData.created_by
            });
            toast.error('You do not have permission to edit this event');
            throw new Error('You do not have permission to edit this event');
          }
          
          // Preserve the original created_by field
          cleanedData.created_by = initialData.created_by;
          result = await updateEvent(initialData.id, cleanedData);
        }
      } else {
        // This is a create operation
        console.log('Creating new event with user ID:', userId);
        cleanedData.created_by = userId;
        result = await createEvent(cleanedData);
      }
      
      if (result.error) {
        console.error('Event save error:', result.error);
        toast.error(result.error.message || 'Failed to save event');
        throw new Error(result.error.message || 'Failed to save event');
      }
      
      toast.success(initialData?.id ? 'Event updated successfully' : 'Event created successfully');
      
      if (onSuccess) {
        onSuccess();
      }
      
      return result.data;
    } catch (error: any) {
      console.error('Event form submission error:', error);
      
      // Check for specific Supabase error patterns
      const errorMessage = error.message || 'Failed to save event. Please try again.';
      
      // Handle specific error types more gracefully
      if (errorMessage.includes('JSON object requested')) {
        toast.error('Event could not be updated. Please check that you have permission to edit this event.');
      } else if (errorMessage.includes('permission')) {
        toast.error('Permission denied: You do not have access to edit this event');
      } else {
        toast.error(errorMessage);
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { handleSubmit, isSubmitting };
}
