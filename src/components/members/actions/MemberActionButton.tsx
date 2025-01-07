import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface MemberActionButtonProps {
  onClick: () => void;
}

export function MemberActionButton({ onClick }: MemberActionButtonProps) {
  return (
    <Button 
      variant="ghost" 
      className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
      onClick={onClick}
      aria-label="Open menu"
    >
      <MoreHorizontal className="h-4 w-4 text-slate-600 dark:text-slate-400" />
    </Button>
  );
}