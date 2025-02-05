
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function usePollSharing(pollId: string) {
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState<string>("");

  const { data: poll } = useQuery({
    queryKey: ['poll-share-token', pollId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('share_token')
        .eq('id', pollId)
        .single();

      if (error) throw error;
      if (data?.share_token) {
        const baseUrl = window.location.origin;
        setShareUrl(`${baseUrl}/polls/share/${data.share_token}`);
      }
      return data;
    },
    enabled: !!pollId
  });

  const { data: existingShares = [] } = useQuery({
    queryKey: ['poll-shares', pollId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('poll_shares')
        .select('shared_with')
        .eq('poll_id', pollId);

      if (error) throw error;
      return data.map(share => share.shared_with);
    },
    enabled: !!pollId
  });

  const handleShare = async () => {
    if (selectedUsers.length === 0) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('poll_shares')
      .insert(
        selectedUsers.map(userId => ({
          poll_id: pollId,
          shared_with: userId,
          shared_by: user.id
        }))
      );

    if (error) {
      console.error('Error sharing poll:', error);
      toast({
        title: "Error",
        description: "Failed to share poll",
        variant: "destructive"
      });
      return;
    }

    const notifications = selectedUsers.map(userId => ({
      user_id: userId,
      type: 'poll_share',
      title: 'New Poll Shared',
      message: `A poll has been shared with you. Click to view: ${shareUrl}`,
      related_entity_id: pollId
    }));

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (notificationError) {
      console.error('Error creating notifications:', notificationError);
    }

    toast({
      title: "Success",
      description: "Poll shared successfully"
    });

    setSelectedUsers([]);
  };

  const copyShareUrl = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Success",
        description: "Share URL copied to clipboard"
      });
    }
  };

  return {
    shareUrl,
    selectedUsers,
    setSelectedUsers,
    existingShares,
    handleShare,
    copyShareUrl
  };
}
