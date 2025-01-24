import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { QueryClient } from "@tanstack/react-query";

export const clearSessionData = async () => {
  try {
    await supabase.auth.signOut();
    const queryClient = new QueryClient();
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();
    console.log('Session data cleared successfully');
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
};

export const isRefreshTokenError = (error: AuthError) => {
  return error.message.includes('refresh_token_not_found') || 
         error.message.includes('Invalid Refresh Token');
};

export const refreshSession = async () => {
  try {
    const { data: { session: refreshedSession }, error: refreshError } = 
      await supabase.auth.refreshSession();
      
    if (refreshError) {
      console.error('Session refresh error:', refreshError);
      throw refreshError;
    }
    
    return refreshedSession;
  } catch (error) {
    console.error('Error refreshing session:', error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Get session error:', error);
      throw error;
    }
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};