import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EditableContentProps {
  content: string;
  pageId: string;
  sectionId: string;
  onUpdate: (newContent: string) => void;
}

export function EditableContent({ content, pageId, sectionId, onUpdate }: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        setIsAdmin(!!data?.is_admin);
      }
    };
    
    checkAdminStatus();
  }, []);

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to edit content",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('page_content')
        .upsert({
          page_id: pageId,
          section_id: sectionId,
          content: editedContent,
          updated_by: user.id,
        });

      if (error) throw error;

      onUpdate(editedContent);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="relative group">
      {!isEditing ? (
        <>
          <div className="prose max-w-none whitespace-pre-wrap">{content}</div>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <div className="space-y-2">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[200px] w-full"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditedContent(content);
                setIsEditing(false);
              }}
            >
              <XIcon className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-[#0d97d1] hover:bg-[#0d97d1]/90"
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}