
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { UpdateUserRequest } from './types.ts'

export async function getUserData(supabaseAdmin: SupabaseClient, userId: string) {
  // Get auth user data
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
  
  if (userError) {
    console.error('Error fetching user:', userError)
    throw userError
  }

  // Get profile data
  const { data: profileData, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    throw profileError
  }

  return { user: userData.user, profile: profileData }
}

export async function updateUserData(
  supabaseAdmin: SupabaseClient,
  adminId: string,
  requestData: UpdateUserRequest
) {
  const { userId, username, fullName, isAdmin, isApproved, isMember, avatarUrl, email, password } = requestData

  // Validate admin status
  const { data: adminCheck, error: adminCheckError } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', adminId)
    .single()

  if (adminCheckError || !adminCheck?.is_admin) {
    throw new Error('Unauthorized - Admin access required')
  }

  // Update auth user if email or password provided
  if (email || password) {
    console.log('Updating auth user:', {
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

  console.log('Updating profile:', { userId, updates })

  const { error: profileUpdateError } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (profileUpdateError) {
    console.error('Error updating profile:', profileUpdateError)
    throw profileUpdateError
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
    // Don't throw here as this is not critical
  }
}
