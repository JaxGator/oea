
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { pollSharingService } from "@/services/pollSharingService";

export function usePollSharing(pollId: string) {
  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState<string>("");

  const { data: poll } = useQuery({
    queryKey: ['poll-share-token', pollId],
    queryFn: async () => {
      const shareToken = await pollSharingService.getPollShareToken(pollId);
      if (shareToken) {
        const baseUrl = window.location.origin;
        setShareUrl(`${baseUrl}/polls/share/${shareToken}`);
      }
      return { share_token: shareToken };
    },
    retry: 1
  });

  const { data: existingShares = [] } = useQuery({
    queryKey: ['poll-shares', pollId],
    queryFn: () => pollSharingService.getPollShares(pollId),
    retry: 1
  });

  const handleShare = async () => {
    if (selectedUsers.length === 0) return;

    try {
      await pollSharingService.sharePoll(pollId, selectedUsers, shareUrl);
      
      toast({
        title: "Success",
        description: "Poll shared successfully"
      });

      setSelectedUsers([]);
    } catch (error) {
      console.error('Error sharing poll:', error);
      toast({
        title: "Error",
        description: "Failed to share poll",
        variant: "destructive"
      });
    }
  };

  const copyShareUrl = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Success",
          description: "Share URL copied to clipboard"
        });
      } catch (error) {
        console.error('Error copying share URL:', error);
        toast({
          title: "Error",
          description: "Failed to copy share URL",
          variant: "destructive"
        });
      }
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
