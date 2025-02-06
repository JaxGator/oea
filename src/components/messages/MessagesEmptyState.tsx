
import { Card } from "@/components/ui/card";
import { Inbox } from "lucide-react";
import { MessagesHeader } from "./MessagesHeader";

export function MessagesEmptyState() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mb-12">
      <MessagesHeader />
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Inbox className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No messages yet</h3>
            <p className="text-muted-foreground">
              Start a conversation or create a group chat to begin messaging.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
