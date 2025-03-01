
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Check, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminNotification } from "./types";

interface NotificationItemProps {
  notification: AdminNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isMarkingAsRead: boolean;
  isDeleting: boolean;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  isMarkingAsRead,
  isDeleting
}: NotificationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div
      className={`p-4 rounded-lg border ${
        notification.is_read ? 'bg-gray-50' : 'bg-white border-blue-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 w-full">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{notification.message}</p>
            <Badge variant={notification.type === 'auth' ? 'secondary' : 'default'}>
              {notification.type}
            </Badge>
            {!notification.is_read && (
              <Badge variant="destructive" className="px-1.5 py-0 text-[10px]">
                NEW
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
          
          <div className="flex justify-between items-center mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-2 py-1 h-auto text-xs"
              onClick={toggleExpansion}
            >
              {isExpanded ? (
                <span className="flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Hide Details
                </span>
              ) : (
                <span className="flex items-center">
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show Details
                </span>
              )}
            </Button>
          </div>
          
          {isExpanded && notification.metadata && (
            <div className="mt-2 text-sm bg-gray-50 p-3 rounded border text-gray-700 whitespace-pre-wrap">
              {typeof notification.metadata === 'string' ? (
                notification.metadata
              ) : (
                <pre className="overflow-auto text-xs">
                  {JSON.stringify(notification.metadata, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
        <div className="flex space-x-1 ml-2">
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              disabled={isMarkingAsRead}
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
            disabled={isDeleting}
            title="Delete notification"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
