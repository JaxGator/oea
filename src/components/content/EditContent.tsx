import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, XIcon } from "lucide-react";

interface EditContentProps {
  content: string;
  editedContent: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditContent({ 
  content, 
  editedContent, 
  onContentChange, 
  onSave, 
  onCancel 
}: EditContentProps) {
  return (
    <div className="space-y-2">
      <Textarea
        value={editedContent}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[200px] w-full"
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          <XIcon className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
        >
          <CheckIcon className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
}