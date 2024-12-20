import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useContentEditor(initialContent: string, pageId: string, sectionId: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(initialContent);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

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

  const handleSave = async (onUpdate: (newContent: string) => void) => {
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

      // First, check if the record exists
      const { data: existingContent } = await supabase
        .from('page_content')
        .select('id')
        .eq('page_id', pageId)
        .eq('section_id', sectionId)
        .maybeSingle();

      let error;
      
      if (existingContent) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('page_content')
          .update({
            content: editedContent,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq('page_id', pageId)
          .eq('section_id', sectionId);
          
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('page_content')
          .insert({
            page_id: pageId,
            section_id: sectionId,
            content: editedContent,
            updated_by: user.id,
          });
          
        error = insertError;
      }

      if (error) throw error;

      // Call onUpdate to update the parent component's state
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

  return {
    isEditing,
    setIsEditing,
    editedContent,
    setEditedContent,
    isAdmin,
    handleSave
  };
}