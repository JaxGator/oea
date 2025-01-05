import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthState } from "@/hooks/useAuthState";

export function useGroupChatCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthState();

  const createGroupChat = async (chatName: string, participantIds: string[]) => {
    if (!chatName.trim() || participantIds.length === 0 || !user?.id) {
      toast({
        title: "Validation Error",
        description: "Please provide a chat name and select at least one participant",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    try {
      // Start a Supabase transaction using RPC
      const { data: chatData, error: chatError } = await supabase
        .rpc('create_group_chat_with_participants', {
          p_chat_name: chatName.trim(),
          p_creator_id: user.id,
          p_participant_ids: [...participantIds, user.id]
        });

      if (chatError) {
        console.error('Error creating group chat:', chatError);
        toast({
          title: "Error",
          description: "Failed to create group chat. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Group chat created successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error in createGroupChat:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createGroupChat,
    isLoading
  };
}