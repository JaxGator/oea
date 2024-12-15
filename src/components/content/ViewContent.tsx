import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

interface ViewContentProps {
  content: string;
  onEdit: () => void;
}

export function ViewContent({ content, onEdit }: ViewContentProps) {
  return (
    <>
      <div className="prose max-w-none whitespace-pre-wrap">{content}</div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onEdit}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
    </>
  );
}