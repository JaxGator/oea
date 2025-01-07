import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export function MemberActionButton() {
  return (
    <Button
      variant="ghost"
      className="h-8 w-8 p-0"
      aria-label="Open menu"
    >
      <MoreVertical className="h-4 w-4" />
    </Button>
  );
}