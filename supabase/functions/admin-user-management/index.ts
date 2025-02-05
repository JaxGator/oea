
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './types.ts'
import { createSupabaseAdmin } from './supabaseClient.ts'
import { verifyAdminUser } from './authUtils.ts'
import { getUserData, updateUserData } from './userOperations.ts'
import { UpdateUserRequest } from './types.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createSupabaseAdmin()

    // Validate auth token
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    const adminUser = await verifyAdminUser(supabaseAdmin, authHeader)

    const requestData: UpdateUserRequest = await req.json()
    const { action, userId } = requestData

    // Handle get_user action
    if (action === 'get_user') {
      console.log('Fetching user data for:', userId)
      const userData = await getUserData(supabaseAdmin, userId)
      
      return new Response(
        JSON.stringify({ email: userData.user.email }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Handle update action (default)
    console.log('Updating user:', { 
      userId, 
      username: requestData.username, 
      fullName: requestData.fullName, 
      isAdmin: requestData.isAdmin, 
      isApproved: requestData.isApproved, 
      isMember: requestData.isMember, 
      avatarUrl: requestData.avatarUrl, 
      hasEmail: !!requestData.email, 
      hasPassword: !!requestData.password 
    })

    await updateUserData(supabaseAdmin, adminUser.id, requestData)

    return new Response(
      JSON.stringify({ message: 'User updated successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in admin-user-management function:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
