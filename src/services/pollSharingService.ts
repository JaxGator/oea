
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { handleQueryResult } from '@/utils/supabase-helpers';

export async function getPublicPollData(pollId: string) {
  const response = await supabase
    .from('polls')
    .select(`
      id, 
      title, 
      description, 
      closes_at,
      created_at,
      poll_options (
        id,
        text,
        poll_id,
        poll_votes (
          id,
          user_id
        )
      )
    `)
    .eq('id', pollId)
    .eq('is_public', true)
    .single();

  return handleQueryResult(response, "Could not load poll data");
}

export async function getPublicPollVoters(pollId: string) {
  const response = await supabase
    .from('poll_votes')
    .select(`
      id,
      poll_option_id,
      profiles: user_id (
        id,
        username,
        avatar_url,
        full_name
      )
    `)
    .eq('poll_id', pollId);

  return handleQueryResult(response, "Could not load poll voters");
}

export async function castPublicVote(pollId: string, optionId: string, userId: string) {
  try {
    // Check if poll is public
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('is_public, closes_at' as any)
      .eq('id', pollId)
      .single();

    if (pollError) throw new Error("Poll not found");
    
    if (!(poll as any).is_public) {
      throw new Error("This poll is not public");
    }
    
    if ((poll as any).closes_at && new Date((poll as any).closes_at) < new Date()) {
      throw new Error("This poll has closed");
    }

    // Check if user has already voted in this poll
    const { data: existingVotes, error: votesError } = await supabase
      .from('poll_votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('user_id', userId);

    if (votesError) throw votesError;
    
    if (existingVotes && existingVotes.length > 0) {
      // Delete existing vote
      const { error: deleteError } = await supabase
        .from('poll_votes')
        .delete()
        .eq('poll_id', pollId)
        .eq('user_id', userId);
        
      if (deleteError) throw deleteError;
    }

    // Insert the new vote
    const { error: insertError } = await supabase
      .from('poll_votes')
      .insert({
        poll_id: pollId,
        poll_option_id: optionId,
        user_id: userId
      });

    if (insertError) throw insertError;

    return true;
  } catch (error) {
    console.error('Error casting vote:', error);
    toast.error(error instanceof Error ? error.message : "Failed to cast vote");
    return false;
  }
}

// Adding the missing functions required by usePollSharing.ts

export async function getPollShareToken(pollId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('polls')
      .select('share_token')
      .eq('id', pollId)
      .single();
    
    if (error) {
      console.error('Error getting poll share token:', error);
      return null;
    }
    
    // If no token exists, generate one
    if (!data.share_token) {
      const newToken = generateShareToken();
      
      const { error: updateError } = await supabase
        .from('polls')
        .update({ share_token: newToken })
        .eq('id', pollId);
      
      if (updateError) {
        console.error('Error updating poll share token:', updateError);
        return null;
      }
      
      return newToken;
    }
    
    return data.share_token;
  } catch (error) {
    console.error('Error in getPollShareToken:', error);
    return null;
  }
}

export async function getPollShares(pollId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('poll_shares')
      .select(`
        id,
        created_at,
        recipient_id,
        profiles:recipient_id (
          id,
          username,
          avatar_url,
          full_name
        )
      `)
      .eq('poll_id', pollId);
    
    if (error) {
      console.error('Error getting poll shares:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getPollShares:', error);
    return [];
  }
}

export async function sharePoll(pollId: string, userIds: string[], shareUrl: string): Promise<boolean> {
  try {
    // Create share records
    const shareData = userIds.map(userId => ({
      poll_id: pollId,
      recipient_id: userId,
      created_at: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('poll_shares')
      .insert(shareData);
    
    if (error) throw error;
    
    // Optionally send notifications to users
    for (const userId of userIds) {
      await createPollShareNotification(userId, pollId, shareUrl);
    }
    
    return true;
  } catch (error) {
    console.error('Error sharing poll:', error);
    return false;
  }
}

// Helper functions

function generateShareToken(): string {
  // Create a random alphanumeric string
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

async function createPollShareNotification(
  userId: string, 
  pollId: string, 
  shareUrl: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'poll_share',
        title: 'New Poll Shared With You',
        content: 'Someone has shared a poll with you',
        link: shareUrl,
        metadata: { poll_id: pollId },
        is_read: false
      });
    
    if (error) {
      console.error('Error creating poll share notification:', error);
    }
  } catch (error) {
    console.error('Error in createPollShareNotification:', error);
  }
}
