import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

interface AdminUserActionsProps {
  profile: {
    id: string;
    email?: string;
    is_admin: boolean;
  };
  onUpdateStatus: (email: string) => void;
  isUpdating: boolean;
}

export function AdminUserActions({ profile, onUpdateStatus, isUpdating }: AdminUserActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {!profile.is_admin && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => profile.email && onUpdateStatus(profile.email)}
          disabled={isUpdating}
        >
          <Shield className="h-4 w-4 mr-1" />
          Make Admin
        </Button>
      )}
    </div>
  );
}