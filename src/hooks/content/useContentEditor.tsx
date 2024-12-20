import { useContentState } from "./useContentState";
import { useContentSave } from "./useContentSave";
import { useAuthState } from "@/hooks/useAuthState";

export function useContentEditor(initialContent: string, pageId: string, sectionId: string) {
  const { profile } = useAuthState();
  const isAdmin = profile?.is_admin ?? false;

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
    onUpdate: () => {},
    setIsEditing,
  });

  const handleSave = async () => {
    await saveContent(editedContent);
  };

  return {
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    startEditing,
    handleSave,
    cancelEditing,
    isAdmin,
  };
}