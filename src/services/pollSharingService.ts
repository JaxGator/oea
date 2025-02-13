
import { supabase } from "@/integrations/supabase/client";
import { handleQueryResult } from "@/utils/supabase-helpers";
import type { Database } from "@/types/database.types";

export interface PollSharing {
  shareToken: string | null;
  existingShares: string[];
}

export const pollSharingService = {
  async getPollShareToken(pollId: string): Promise<string | null> {
    const response = await supabase
      .from('polls')
      .select('share_token')
      .eq('id', pollId as string)
      .maybeSingle();

    if (response.error) {
      console.error('Error fetching share token:', response.error);
      throw response.error;
    }
    return response.data?.share_token ?? null;
  },

  async getPollShares(pollId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('poll_shares')
      .select('shared_with')
      .eq('poll_id', pollId);

    if (error) {
      console.error('Error fetching poll shares:', error);
      throw error;
    }
    return (data || []).map(share => share.shared_with);
  },

  async sharePoll(pollId: string, selectedUsers: string[], shareUrl: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    // Create poll shares
    const { error: shareError } = await supabase
      .from('poll_shares')
      .insert(selectedUsers.map(userId => ({
        poll_id: pollId,
        shared_with: userId,
        shared_by: user.id
      })));

    if (shareError) {
      console.error('Error sharing poll:', shareError);
      throw shareError;
    }

    // Create notifications
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert(selectedUsers.map(userId => ({
        user_id: userId,
        type: 'poll_share',
        title: 'New Poll Shared',
        message: `A poll has been shared with you. Click to view: ${shareUrl}`,
        related_entity_id: pollId
      })));

    if (notificationError) {
      console.error('Error creating notifications:', notificationError);
      throw notificationError;
    }
  }
};
