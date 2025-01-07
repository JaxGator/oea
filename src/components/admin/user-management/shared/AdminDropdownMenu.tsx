import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface AdminDropdownAction {
  label: string;
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

interface AdminDropdownMenuProps {
  actions: AdminDropdownAction[];
}

export function AdminDropdownMenu({ actions }: AdminDropdownMenuProps) {
  const handleActionClick = (e: React.MouseEvent, action: AdminDropdownAction) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('AdminDropdownMenu: Action clicked:', action.label);
    action.onClick(e);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Open menu"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="min-w-[160px]"
      >
        {actions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => handleActionClick(e, action)}
            disabled={action.disabled}
            className={action.className}
          >
            {action.icon}
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}