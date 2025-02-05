
import { supabase } from "@/integrations/supabase/client";

export interface PollSharing {
  shareToken: string | null;
  existingShares: string[];
}

export const pollSharingService = {
  async getPollShareToken(pollId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('polls')
      .select('share_token')
      .eq('id', pollId)
      .single();

    if (error) throw error;
    return data?.share_token ?? null;
  },

  async getPollShares(pollId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('poll_shares')
      .select('shared_with')
      .eq('poll_id', pollId);

    if (error) throw error;
    return data.map(share => share.shared_with);
  },

  async sharePoll(pollId: string, selectedUsers: string[], shareUrl: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Share the poll with selected users
    const { error: shareError } = await supabase
      .from('poll_shares')
      .insert(
        selectedUsers.map(userId => ({
          poll_id: pollId,
          shared_with: userId,
          shared_by: user.id
        }))
      );

    if (shareError) throw shareError;

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

    if (notificationError) throw notificationError;
  }
};
