
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Member } from "@/components/members/types";

interface EditUserButtonProps {
  profile: Member;
  onEdit: (member: Member) => void;
}

export function EditUserButton({ profile, onEdit }: EditUserButtonProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(profile);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleEdit}
      className="whitespace-nowrap"
    >
      <Edit2 className="h-4 w-4 mr-2" />
      Edit
    </Button>
  );
}
