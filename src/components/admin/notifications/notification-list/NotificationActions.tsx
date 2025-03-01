
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NotificationActionsProps {
  readCount: number;
  onClearReadNotifications: () => void;
  isDeleting: boolean;
}

export function NotificationActions({ 
  readCount, 
  onClearReadNotifications, 
  isDeleting 
}: NotificationActionsProps) {
  if (readCount === 0) return null;

  return (
    <div className="flex justify-end">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onClearReadNotifications}
        disabled={isDeleting}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Clear Read Notifications
      </Button>
    </div>
  );
}
