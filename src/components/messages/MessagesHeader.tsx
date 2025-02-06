
import { Mail } from "lucide-react";
import { NewDirectMessageDialog } from "./direct/NewDirectMessageDialog";
import { CreateGroupChatDialog } from "./group/CreateGroupChatDialog";

export function MessagesHeader() {
  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="h-7 w-7" />
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      <div className="flex gap-2">
        <NewDirectMessageDialog />
        <CreateGroupChatDialog />
      </div>
    </div>
  );
}
