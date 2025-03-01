
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./notification-list/NotificationItem";
import { NotificationActions } from "./notification-list/NotificationActions";
import { useNotifications } from "./notification-list/useNotifications";

export function AdminNotificationList() {
  const {
    notifications,
    isLoading,
    error,
    readCount,
    markAsRead,
    deleteNotification,
    deleteAllReadNotifications,
    isDeleting,
    isMarkingAsRead,
    isDeletingNotification
  } = useNotifications();

  if (isLoading) {
    return (
      <div className="text-center py-4">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load notifications
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No notifications
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <NotificationActions 
        readCount={readCount} 
        onClearReadNotifications={deleteAllReadNotifications}
        isDeleting={isDeleting}
      />
      
      <ScrollArea className="h-[400px] w-full">
        <div className="space-y-3 p-1">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              isMarkingAsRead={isMarkingAsRead}
              isDeleting={isDeletingNotification}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
