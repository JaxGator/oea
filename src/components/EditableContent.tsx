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
    editedContent,
    setEditedContent,
    startEditing,
    handleSave,
    cancelEditing
  } = useContentEditor({
    initialContent: content,
    pageId,
    sectionId,
    onUpdate,
  });

  return (
    <div className="relative group">
      {!isEditing ? (
        <ViewContent 
          content={content} 
          onEdit={startEditing}
          showEditButton={false}
        />
      ) : (
        <EditContent
          content={content}
          editedContent={editedContent}
          onContentChange={setEditedContent}
          onSave={handleSave}
          onCancel={cancelEditing}
        />
      )}
    </div>
  );
}