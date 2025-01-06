import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { UserList } from "@/components/messages/UserList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { Button } from "@/components/ui/button";
import { MessageSquare, MessagesSquare } from "lucide-react";

export default function Messages() {
  const { profile } = useAuthState();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  if (!profile?.is_approved) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Your account needs to be approved before you can send messages.
            Please wait for an administrator to approve your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessagesSquare className="h-6 w-6" />
            Messages
          </h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <MessageSquare className="h-4 w-4" />
              Direct Messages
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-16rem)]">
        <div className="w-full lg:w-full border rounded-lg bg-white flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="p-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Users
            </h2>
          </div>
          <UserList onSelectUser={setSelectedUserId} selectedUserId={selectedUserId} />
        </div>

        <div className="lg:col-span-2 border rounded-lg bg-white overflow-hidden min-h-[400px] lg:min-h-0">
          <ChatWindow selectedUserId={selectedUserId} />
        </div>
      </div>
    </div>
  );
}