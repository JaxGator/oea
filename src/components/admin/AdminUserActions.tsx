import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface AdminUserActionsProps {
  profile: {
    id: string;
    username: string;
    is_admin: boolean;
  };
  onUpdateStatus: (username: string) => void;
  isUpdating: boolean;
}

export function AdminUserActions({ profile, onUpdateStatus, isUpdating }: AdminUserActionsProps) {
  return (
    <div className="flex items-center">
      {!profile.is_admin && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateStatus(profile.username)}
          disabled={isUpdating}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          <Shield className="h-4 w-4 mr-1" />
          Make Admin
        </Button>
      )}
    </div>
  );
}