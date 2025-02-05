
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { UpdateUserRequest } from './types.ts'

export async function getUserData(supabaseAdmin: SupabaseClient, userId: string) {
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
  
  if (userError) {
    console.error('Error fetching user:', userError)
    throw userError
  }

  return userData
}

export async function updateUserData(
  supabaseAdmin: SupabaseClient,
  adminId: string,
  requestData: UpdateUserRequest
) {
  const { userId, username, fullName, isAdmin, isApproved, isMember, avatarUrl, email, password } = requestData

  // Update auth user if email or password provided
  if (email || password) {
    console.log('Attempting auth update with:', {
      userId,
      hasEmail: !!email,
      hasPassword: !!password
    })

    const authUpdate: { email?: string; password?: string } = {}
    if (email) {
      if (!email.includes('@')) {
        throw new Error('Invalid email format')
      }
      authUpdate.email = email
    }
    if (password) {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      authUpdate.password = password
    }

    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      authUpdate
    )

    if (authUpdateError) {
      console.error('Error updating auth user:', authUpdateError)
      throw authUpdateError
    }
  }

  // Update profile data
  const updates: any = {}
  if (username !== undefined) updates.username = username
  if (fullName !== undefined) updates.full_name = fullName
  if (isAdmin !== undefined) updates.is_admin = isAdmin
  if (isApproved !== undefined) updates.is_approved = isApproved
  if (isMember !== undefined) updates.is_member = isMember
  if (avatarUrl !== undefined) updates.avatar_url = avatarUrl
  if (email !== undefined) updates.email = email

  console.log('Attempting profile update with:', updates)

  const { error: updateProfileError } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (updateProfileError) {
    console.error('Error updating profile:', updateProfileError)
    throw updateProfileError
  }

  // Log the admin action
  const { error: logError } = await supabaseAdmin
    .from('admin_logs')
    .insert({
      admin_id: adminId,
      action_type: 'update_user',
      target_type: 'user',
      target_id: userId,
      details: updates
    })

  if (logError) {
    console.error('Error creating admin log:', logError)
  }
}
