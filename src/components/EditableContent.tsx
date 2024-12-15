import { ViewContent } from "./content/ViewContent";
import { EditContent } from "./content/EditContent";
import { useContentEditor } from "./content/useContentEditor";

interface EditableContentProps {
  content: string;
  pageId: string;
  sectionId: string;
  onUpdate: (newContent: string) => void;
}

export function EditableContent({ content, pageId, sectionId, onUpdate }: EditableContentProps) {
  const {
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    isAdmin,
    handleSave
  } = useContentEditor(content, pageId, sectionId);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="relative group">
      {!isEditing ? (
        <ViewContent 
          content={content} 
          onEdit={() => setIsEditing(true)} 
        />
      ) : (
        <EditContent
          content={content}
          editedContent={editedContent}
          onContentChange={setEditedContent}
          onSave={() => handleSave(onUpdate)}
          onCancel={() => {
            setEditedContent(content);
            setIsEditing(false);
          }}
        />
      )}
    </div>
  );
}