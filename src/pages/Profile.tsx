import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, UserCircle, Save, Mail, Lock } from "lucide-react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
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
        .select("username, full_name, avatar_url")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      setUsername(data.username || "");
      setFullName(data.full_name || "");
      setAvatarUrl(data.avatar_url || "");
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

  return (
    <div className="min-h-screen bg-[#222222] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-6">
            <UserCircle className="h-12 w-12 text-[#0d97d1]" />
            <h1 className="text-2xl font-bold">Profile Settings</h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Enter your avatar URL"
              />
            </div>

            <Button
              onClick={updateProfile}
              className="w-full bg-[#0d97d1] hover:bg-[#0b86b8] text-white"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Profile Changes
            </Button>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                  <Button
                    onClick={updateEmail}
                    className="mt-2 bg-[#0d97d1] hover:bg-[#0b86b8] text-white"
                  >
                    Update Email
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      placeholder="Enter new password"
                    />
                  </div>
                  <Button
                    onClick={updatePassword}
                    className="mt-2 bg-[#0d97d1] hover:bg-[#0b86b8] text-white"
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}