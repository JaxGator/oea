import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface UserRoleFieldsProps {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  isApproved: boolean;
  setIsApproved: (value: boolean) => void;
  isMember: boolean;
  setIsMember: (value: boolean) => void;
}

export function UserRoleFields({
  isAdmin,
  setIsAdmin,
  isApproved,
  setIsApproved,
  isMember,
  setIsMember,
}: UserRoleFieldsProps) {
  return (
    <div className="space-y-4">
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
  );
}