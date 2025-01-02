import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="min-h-[200px] flex-grow">
        <ReactQuill
          theme="snow"
          value={editedContent}
          onChange={onContentChange}
          modules={modules}
          className="bg-white h-full"
          style={{ minHeight: '200px' }}
        />
      </div>
      <div className="flex justify-end gap-2 pt-14 sticky bottom-0 bg-white z-50 mt-4">
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