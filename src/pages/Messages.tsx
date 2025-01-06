import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { UserList } from "@/components/messages/UserList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { CreateGroupChatDialog } from "@/components/messages/CreateGroupChatDialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, MessagesSquare, Users } from "lucide-react";
import { GroupChatList } from "@/components/messages/GroupChatList";

export default function Messages() {
  const { profile } = useAuthState();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessagesSquare className="h-6 w-6" />
            Messages
          </h1>
          <CreateGroupChatDialog />
        </div>
        
        <Tabs defaultValue="direct" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Direct Messages
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group Chats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="direct" className="mt-0">
            <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-12rem)]">
              <div className="w-full lg:w-1/3 border rounded-lg bg-white flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
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
              
              <div className="w-full lg:w-2/3 border rounded-lg bg-white flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
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
          </TabsContent>

          <TabsContent value="group" className="mt-0">
            <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-12rem)]">
              <div className="w-full lg:w-1/3 border rounded-lg bg-white flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
                <div className="p-3 border-b bg-gray-50">
                  <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Group Chats
                  </h2>
                </div>
                <div className="flex-1 overflow-hidden">
                  <GroupChatList onSelectGroup={setSelectedGroupId} selectedGroupId={selectedGroupId} />
                </div>
              </div>
              
              <div className="w-full lg:w-2/3 border rounded-lg bg-white flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
                <div className="p-3 border-b bg-gray-50">
                  <h2 className="font-semibold text-gray-700">
                    {selectedGroupId ? "Group Chat" : "Select a group chat"}
                  </h2>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ChatWindow groupId={selectedGroupId} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}