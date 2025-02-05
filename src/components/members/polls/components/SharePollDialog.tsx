
import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SharePollDialogProps {
  pollId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Member {
  id: string;
  username: string;
  avatar_url: string | null;
}

export function SharePollDialog({ pollId, open, onOpenChange }: SharePollDialogProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [shareUrl, setShareUrl] = useState<string>("");

  const { data: members = [] } = useQuery({
    queryKey: ['members-for-sharing'],
    queryFn: async () => {
      const { data: members, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .eq('is_approved', true)
        .or('is_member.eq.true,is_admin.eq.true')
        .order('username');

      if (error) throw error;
      return members as Member[];
    }
  });

  const { data: poll } = useQuery({
    queryKey: ['poll-share-token', pollId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('share_token')
        .eq('id', pollId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!pollId,
    onSuccess: (data) => {
      if (data?.share_token) {
        const baseUrl = window.location.origin;
        setShareUrl(`${baseUrl}/polls/share/${data.share_token}`);
      }
    }
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

  const filteredMembers = members.filter(member => 
    member.username.toLowerCase().includes(search.toLowerCase()) &&
    !existingShares.includes(member.id)
  );

  const handleShare = async () => {
    if (selectedUsers.length === 0) return;

    const { error } = await supabase
      .from('poll_shares')
      .insert(
        selectedUsers.map(userId => ({
          poll_id: pollId,
          shared_with: userId,
          shared_by: (await supabase.auth.getUser()).data.user?.id
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

    // Create notifications for shared users
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
    onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Poll</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {shareUrl && (
            <Alert>
              <AlertDescription className="break-all text-sm">
                {shareUrl}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-2"
                  onClick={copyShareUrl}
                >
                  Copy
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-2 p-2 hover:bg-accent rounded-lg"
                >
                  <Checkbox
                    id={member.id}
                    checked={selectedUsers.includes(member.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedUsers([...selectedUsers, member.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== member.id));
                      }
                    }}
                  />
                  <label
                    htmlFor={member.id}
                    className="flex-grow cursor-pointer text-sm"
                  >
                    {member.username}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={selectedUsers.length === 0}
            >
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
