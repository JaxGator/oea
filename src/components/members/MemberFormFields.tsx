import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
  onSubmit,
}: MemberFormFieldsProps) {
  const { toast } = useToast();
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = () => {
    // Reset password error
    setPasswordError(null);

    // Validate password if one is provided
    if (password && password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    onSubmit();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={email || "Enter email"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New Password (leave empty to keep current)</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(null);
          }}
          placeholder="Enter new password"
          className={passwordError ? "border-red-500" : ""}
        />
        {passwordError && (
          <p className="text-sm text-red-500">{passwordError}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={username || "Enter username"}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={fullName || "Enter full name"}
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
      <Button onClick={handleSubmit} className="w-full">
        Save Changes
      </Button>
    </div>
  );
}