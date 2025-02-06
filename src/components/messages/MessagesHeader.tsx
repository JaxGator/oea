
import { Mail } from "lucide-react";
import { NewDirectMessageDialog } from "./direct/NewDirectMessageDialog";
import { CreateGroupChatDialog } from "./group/CreateGroupChatDialog";

export function MessagesHeader() {
  return (
    <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
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
