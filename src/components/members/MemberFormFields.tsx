import { Button } from "@/components/ui/button";
import { UserInfoFields } from "./form/UserInfoFields";
import { UserRoleFields } from "./form/UserRoleFields";
import { UserAvatar } from "./form/UserAvatar";

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
      <UserAvatar username={username} avatarUrl={avatarUrl} />
      
      <UserInfoFields
        username={username}
        setUsername={setUsername}
        fullName={fullName}
        setFullName={setFullName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
      
      <UserRoleFields
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        isApproved={isApproved}
        setIsApproved={setIsApproved}
        isMember={isMember}
        setIsMember={setIsMember}
      />
      
      <Button onClick={onSubmit} className="w-full">
        Save Changes
      </Button>
    </div>
  );
}