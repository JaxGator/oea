import { useState } from "react";
import { MoreHorizontal, Trash2, Edit2, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChatDialog } from "./ChatDialog";
import { useAuthState } from "@/hooks/useAuthState";

interface MemberActionsProps {
  memberId: string;
  memberName: string;
  isCurrentUserAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function MemberActions({
  memberId,
  memberName,
  isCurrentUserAdmin,
  onEdit,
  onDelete,
}: MemberActionsProps) {
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuthState();

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <MoreHorizontal className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem 
            onClick={() => setShowChat(true)}
            className="cursor-pointer"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </DropdownMenuItem>
          {isCurrentUserAdmin && (
            <>
              <DropdownMenuItem 
                onClick={onEdit}
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="cursor-pointer text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ChatDialog
        open={showChat}
        onOpenChange={setShowChat}
        recipientId={memberId}
        recipientName={memberName}
        currentUserId={user.id}
      />
    </>
  );
}