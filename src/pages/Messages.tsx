import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { UserList } from "@/components/messages/UserList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { CreateGroupChatDialog } from "@/components/messages/CreateGroupChatDialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MessageSquare, MessagesSquare, Users } from "lucide-react";

export default function Messages() {
  const { profile } = useAuthState();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();

  if (!profile?.is_approved) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your account needs to be approved to use the messaging system.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessagesSquare className="h-6 w-6" />
          Messages
        </h1>
        <div className="flex gap-2">
          <CreateGroupChatDialog />
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Direct Messages
          </Button>
        </div>
      </div>
      <div className="flex h-[600px] gap-4">
        <div className="w-1/3 border rounded-lg bg-white flex flex-col overflow-hidden">
          <div className="p-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <UserList onSelectUser={setSelectedUserId} selectedUserId={selectedUserId} />
          </div>
        </div>
        <div className="w-2/3 border rounded-lg bg-white flex flex-col overflow-hidden">
          <div className="p-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-700">
              {selectedUserId ? "Chat" : "Select a user to start messaging"}
            </h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatWindow selectedUserId={selectedUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}