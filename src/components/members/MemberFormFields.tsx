import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";

interface MemberFormFieldsProps {
  username: string;
  setUsername: (value: string) => void;
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  isApproved: boolean;
  setIsApproved: (value: boolean) => void;
  isMember: boolean;
  setIsMember: (value: boolean) => void;
  avatarUrl?: string;
  onSubmit: () => void;
}

export function MemberFormFields({
  username,
  setUsername,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  isAdmin,
  setIsAdmin,
  isApproved,
  setIsApproved,
  isMember,
  setIsMember,
  avatarUrl,
  onSubmit,
}: MemberFormFieldsProps) {
  return (
    <div className="space-y-4">
      {avatarUrl && (
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback>
              <UserCircle className="h-20 w-20" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New Password (leave empty to keep current)</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isAdmin"
          checked={isAdmin}
          onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
        />
        <Label htmlFor="isAdmin">Admin</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isApproved"
          checked={isApproved}
          onCheckedChange={(checked) => setIsApproved(checked as boolean)}
        />
        <Label htmlFor="isApproved">Approved</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isMember"
          checked={isMember}
          onCheckedChange={(checked) => setIsMember(checked as boolean)}
        />
        <Label htmlFor="isMember">Member</Label>
      </div>
      <Button onClick={onSubmit} className="w-full">
        Save Changes
      </Button>
    </div>
  );
}