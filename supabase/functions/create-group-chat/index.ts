import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { p_chat_name, p_creator_id, p_participant_ids } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create chat
    const { data: chatData, error: chatError } = await supabaseClient
      .from('group_chats')
      .insert({
        name: p_chat_name,
        created_by: p_creator_id
      })
      .select()
      .single()

    if (chatError) throw chatError

    // Add participants
    const participants = p_participant_ids.map(userId => ({
      chat_id: chatData.id,
      user_id: userId,
      added_by: p_creator_id
    }))

    const { error: participantsError } = await supabaseClient
      .from('group_chat_participants')
      .insert(participants)

    if (participantsError) {
      // Cleanup if adding participants fails
      await supabaseClient
        .from('group_chats')
        .delete()
        .eq('id', chatData.id)
      
      throw participantsError
    }

    return new Response(
      JSON.stringify({ success: true, data: chatData }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      },
    )
  }
})