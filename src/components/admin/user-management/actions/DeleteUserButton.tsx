import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteUserButtonProps {
  onShowDialog: () => void;
}

export function DeleteUserButton({ onShowDialog }: DeleteUserButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onShowDialog}
      className="whitespace-nowrap text-red-600"
    >
      <Trash2 className="h-4 w-4 mr-2" />
      Delete
    </Button>
  );
}