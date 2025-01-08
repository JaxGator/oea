import { useState } from "react";
import { Member } from "../types";
import { MemberFormFields } from "../MemberFormFields";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditMemberFormProps {
  member: Member;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function EditMemberForm({ 
  member,
  onSubmit,
  isSubmitting,
  onCancel
}: EditMemberFormProps) {
  const [username, setUsername] = useState(member.username);
  const [fullName, setFullName] = useState(member.full_name || "");
  const [email, setEmail] = useState(""); // Email is read-only in edit mode
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(member.is_admin || false);
  const [isApproved, setIsApproved] = useState(member.is_approved || false);
  const [isMember, setIsMember] = useState(member.is_member || false);

  const handleSubmit = async () => {
    await onSubmit();
  };

  return (
    <div className="space-y-6">
      <MemberFormFields
        username={username}
        setUsername={setUsername}
        fullName={fullName}
        setFullName={setFullName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        isApproved={isApproved}
        setIsApproved={setIsApproved}
        isMember={isMember}
        setIsMember={setIsMember}
        avatarUrl={member.avatar_url || undefined}
        onSubmit={handleSubmit}
      />

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
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