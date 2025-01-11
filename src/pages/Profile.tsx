import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { InterestsSection } from "@/components/profile/InterestsSection";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUserId(session.user.id);
      setEmail(session.user.email || "");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, is_approved, is_admin, is_member, interests")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      setUsername(data.username || "");
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
      setIsApproved(data.is_approved || false);
      setIsAdmin(data.is_admin || false);
      setIsMember(data.is_member || false);
      setInterests(data.interests || []);
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
      if (!userId) throw new Error("No user ID");

      const updates = {
        username,
        full_name: fullName,
        avatar_url: avatarUrl,
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  async function updateInterests(newInterests: string[]) {
    try {
      if (!userId) throw new Error("No user ID");

      const { error } = await supabase
        .from("profiles")
        .update({ interests: newInterests })
        .eq("id", userId);

      if (error) throw error;

      setInterests(newInterests);
      toast({
        title: "Interests updated",
        description: "Your interests have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating interests:", error);
      toast({
        title: "Error updating interests",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }

  async function updateEmail() {
    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;

      toast({
        title: "Email update initiated",
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

      setNewPassword(""); // Clear password field after successful update
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#222222] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isApproved && !isAdmin && !isMember) {
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
          {(isApproved || isAdmin || isMember) && (
            <InterestsSection
              interests={interests}
              onUpdateInterests={updateInterests}
            />
          )}
        </div>
      </div>
    </div>
  );
}