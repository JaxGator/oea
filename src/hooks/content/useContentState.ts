import { useState } from "react";

export function useContentState(initialContent: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);

  const startEditing = () => {
    setEditedContent(initialContent);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedContent(initialContent);
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    startEditing,
    cancelEditing,
  };
}