
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useAuthState } from "@/hooks/useAuthState";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAuthState();

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }

    getProfile();
  }, [user, isLoading, navigate]);

  async function getProfile() {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username || "");
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
        setEmail(user.email || "");
        setInterests(data.interests || []);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error loading profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      if (!user?.id) throw new Error("No user ID");

      const updates = {
        username,
        full_name: fullName,
        avatar_url: avatarUrl,
        interests
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      await getProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  }

  async function updateEmail() {
    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Please check your new email for confirmation.",
      });
    } catch (error) {
      console.error("Error updating email:", error);
      toast({
        title: "Error updating email",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  }

  async function updatePassword() {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;

      setNewPassword("");
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error updating password",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    }
  }

  const { data: userEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['user-events', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('event_rsvps')
        .select(`
          *,
          events (
            id,
            title,
            description,
            date,
            time,
            location
          ),
          event_guests (
            id,
            first_name
          )
        `)
        .eq('user_id', user.id)
        .eq('response', 'attending');

      if (error) throw error;
      
      // Transform the event_guests data to match the expected format
      return data.map(rsvp => ({
        ...rsvp,
        event_guests: rsvp.event_guests?.map(guest => ({
          firstName: guest.first_name
        }))
      }));
    },
    enabled: !!user?.id
  });

  const now = new Date();
  const upcomingEvents = userEvents?.filter(rsvp => 
    new Date(`${rsvp.events?.date} ${rsvp.events?.time}`) > now
  ) || [];
  
  const pastEvents = userEvents?.filter(rsvp => 
    new Date(`${rsvp.events?.date} ${rsvp.events?.time}`) <= now
  ) || [];

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!profile?.is_approved && !profile?.is_admin && !profile?.is_member) {
    return (
      <div className="min-h-screen bg-[#222222] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Available</h1>
            <p className="text-gray-600">
              Your account is pending approval. Please wait for an administrator to approve your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-lg space-y-8">
          <ProfileHeader
            avatarUrl={avatarUrl}
            fullName={fullName}
            username={username}
          />
          <ProfileTabs
            profile={profile}
            username={username}
            setUsername={setUsername}
            fullName={fullName}
            setFullName={setFullName}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            email={email}
            setEmail={setEmail}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            interests={interests}
            onUpdateProfile={updateProfile}
            onUpdateEmail={updateEmail}
            onUpdatePassword={updatePassword}
            onUpdateInterests={setInterests}
            upcomingEvents={upcomingEvents}
            pastEvents={pastEvents}
            eventsLoading={eventsLoading}
          />
        </div>
      </div>
    </div>
  );
}
