
import { Member } from "../types";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UserInfoFields } from "../form/UserInfoFields";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface EditMemberFormProps {
  member: Member;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
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
}

export function EditMemberForm({
  member,
  onSubmit,
  isSubmitting,
  onCancel,
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
  setIsMember
}: EditMemberFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
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

        <div className="space-y-2">
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
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}
