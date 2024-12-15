import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Profile, AuthState } from "@/types/auth";
import { useAuthEventHandler } from "./useAuthEventHandler";
import { useToast } from "@/hooks/use-toast";

export function useAuthState(): AuthState {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const handleAuthEvent = useAuthEventHandler();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('Error in fetchProfile:', error);
        toast({
          title: "Error loading profile",
          description: "Please try refreshing the page",
          variant: "destructive",
        });
        return null;
      }
    };

    const initialize = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast({
            title: "Authentication error",
            description: "Please try signing in again",
            variant: "destructive",
          });
          return;
        }

        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            const profileData = await fetchProfile(session.user.id);
            if (profileData) {
              setProfile(profileData);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in initialize:', error);
        if (mounted) {
          setIsLoading(false);
          toast({
            title: "Error initializing",
            description: "Please try refreshing the page",
            variant: "destructive",
          });
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthEvent, toast]);

  return { isLoading, user, profile };
}