import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContentSaveProps {
  pageId: string;
  sectionId: string;
  onUpdate: (content: string) => void;
  setIsEditing: (value: boolean) => void;
}

export function useContentSave({ pageId, sectionId, onUpdate, setIsEditing }: ContentSaveProps) {
  const { toast } = useToast();

  const saveContent = async (content: string) => {
    try {
      // Check if content exists
      const { data: existingContent } = await supabase
        .from('page_content')
        .select()
        .eq('page_id', pageId)
        .eq('section_id', sectionId)
        .maybeSingle();

      let error;
      
      if (existingContent) {
        // Update existing content
        const { error: updateError } = await supabase
          .from('page_content')
          .update({ content })
          .eq('page_id', pageId)
          .eq('section_id', sectionId);
        error = updateError;
      } else {
        // Insert new content
        const { error: insertError } = await supabase
          .from('page_content')
          .insert([{ page_id: pageId, section_id: sectionId, content }]);
        error = insertError;
      }

      if (error) throw error;

      onUpdate(content);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save content",
        variant: "destructive",
      });
    }
  };

  return { saveContent };
}