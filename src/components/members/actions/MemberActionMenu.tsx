import { Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface MemberActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function MemberActionMenu({ onEdit, onDelete }: MemberActionMenuProps) {
  return (
    <DropdownMenuContent align="end" className="w-[160px]">
      <DropdownMenuItem 
        onClick={onEdit}
        className="cursor-pointer"
      >
        <Edit2 className="mr-2 h-4 w-4" />
        Edit
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={onDelete}
        className="cursor-pointer text-red-600"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}