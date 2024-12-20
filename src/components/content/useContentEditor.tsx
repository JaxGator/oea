import { useContentState } from "@/hooks/content/useContentState";
import { useContentSave } from "@/hooks/content/useContentSave";

interface UseContentEditorProps {
  pageId: string;
  sectionId: string;
  initialContent: string;
  onUpdate: (content: string) => void;
}

export function useContentEditor({
  pageId,
  sectionId,
  initialContent,
  onUpdate,
}: UseContentEditorProps) {
  const {
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    startEditing,
    cancelEditing,
  } = useContentState(initialContent);

  const { saveContent } = useContentSave({
    pageId,
    sectionId,
    onUpdate,
    setIsEditing,
  });

  const handleSave = async () => {
    await saveContent(editedContent);
  };

  return {
    isEditing,
    editedContent,
    setEditedContent,
    startEditing,
    handleSave,
    cancelEditing,
  };
}