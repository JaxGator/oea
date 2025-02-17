import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { InterestsSection } from "@/components/profile/InterestsSection";
import { useAuthState } from "@/hooks/useAuthState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

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
          )
        `)
        .eq('user_id', user.id)
        .eq('response', 'attending');

      if (error) throw error;
      return data;
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

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileForm
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
                onUpdateProfile={updateProfile}
                onUpdateEmail={updateEmail}
                onUpdatePassword={updatePassword}
              />
              {(profile?.is_approved || profile?.is_admin || profile?.is_member) && (
                <InterestsSection
                  interests={interests}
                  onUpdateInterests={(newInterests) => {
                    setInterests(newInterests);
                    updateProfile();
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="upcoming">
              {eventsLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No upcoming events found
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((rsvp) => (
                    <Card key={rsvp.id}>
                      <CardHeader>
                        <CardTitle>{rsvp.events?.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(`${rsvp.events?.date} ${rsvp.events?.time}`), 'PPp')}
                          <br />
                          {rsvp.events?.location}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {eventsLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pastEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No past events found
                </p>
              ) : (
                <div className="space-y-4">
                  {pastEvents.map((rsvp) => (
                    <Card key={rsvp.id}>
                      <CardHeader>
                        <CardTitle>{rsvp.events?.title}</CardTitle>
                        <CardDescription>
                          {format(new Date(`${rsvp.events?.date} ${rsvp.events?.time}`), 'PPp')}
                          <br />
                          {rsvp.events?.location}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
