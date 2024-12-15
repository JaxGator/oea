import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { Profile } from "@/integrations/supabase/types/tables";

export default function Index() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();

    // Subscribe to real-time profile updates
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload: RealtimePostgresChangesPayload<Profile>) => {
          console.log('Profile update received:', payload);
          if (payload.new) {
            supabase.auth.getUser().then(({ data: { user } }) => {
              if (user && payload.new && payload.new.id === user.id) {
                setUsername(payload.new.username || "");
                setAvatarUrl(payload.new.avatar_url || "");
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function getProfile() {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session?.user) {
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      setUsername(data.username || "");
      setAvatarUrl(data.avatar_url || "");
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={avatarUrl} 
                alt={username}
                className="object-cover"
              />
              <AvatarFallback>
                <UserCircle className="h-20 w-20 text-[#0d97d1]" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome{username ? `, ${username}` : ''}!</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}