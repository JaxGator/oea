import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Save } from "lucide-react";

interface ProfileFormProps {
  username: string;
  setUsername: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  avatarUrl: string;
  setAvatarUrl: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  onUpdateProfile: () => void;
  onUpdateEmail: () => void;
  onUpdatePassword: () => void;
}

export function ProfileForm({
  username,
  setUsername,
  fullName,
  setFullName,
  avatarUrl,
  setAvatarUrl,
  email,
  setEmail,
  newPassword,
  setNewPassword,
  onUpdateProfile,
  onUpdateEmail,
  onUpdatePassword,
}: ProfileFormProps) {
  return (
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
            placeholder={username || "Enter your username"}
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
          placeholder={fullName || "Enter your full name"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl">Avatar URL</Label>
        <Input
          id="avatarUrl"
          type="text"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder={avatarUrl || "Enter your avatar URL"}
        />
      </div>

      <Button
        onClick={onUpdateProfile}
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
                placeholder={email || "Enter your email"}
              />
            </div>
            <Button
              onClick={onUpdateEmail}
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
              onClick={onUpdatePassword}
              className="mt-2 bg-[#0d97d1] hover:bg-[#0b86b8] text-white"
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}