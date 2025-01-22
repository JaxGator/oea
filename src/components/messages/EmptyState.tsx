import { Card } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <Inbox className="h-12 w-12 text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">No messages yet</h3>
          <p className="text-muted-foreground">
            When you send or receive messages, they'll appear here.
          </p>
        </div>
      </div>
    </Card>
  );
}