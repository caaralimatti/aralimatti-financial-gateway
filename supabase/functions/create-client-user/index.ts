
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { email, password, fullName, role } = await req.json()

    console.log('🔥 Edge function received request for:', { email, fullName })

    // Validate input
    if (!email || !password || !fullName) {
      console.error('🔥 Missing required fields:', { email: !!email, password: !!password, fullName: !!fullName })
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: 'Email, password, and full name are required'
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if email exists in profiles table first
    console.log('🔥 Checking if email exists in profiles table')
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, role')
      .eq('email', email)
      .limit(1)

    if (profileCheckError) {
      console.error('🔥 Error checking profiles:', profileCheckError)
    } else if (existingProfile && existingProfile.length > 0) {
      console.error('🔥 Email already exists in profiles:', existingProfile[0])
      return new Response(
        JSON.stringify({ 
          error: 'Email already exists',
          details: `A user with email ${email} already exists in the system. Please use a different email address.`,
          errorCode: 'EMAIL_EXISTS_IN_PROFILES'
        }),
        { 
          status: 422, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if email exists in auth.users table (might be orphaned)
    console.log('🔥 Checking if email exists in auth.users table')
    const { data: authUsers, error: authCheckError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authCheckError) {
      console.error('🔥 Error checking auth users:', authCheckError)
    } else {
      const existingAuthUser = authUsers.users.find(user => user.email === email)
      if (existingAuthUser) {
        console.log('🔥 Found orphaned auth user, attempting cleanup:', existingAuthUser.id)
        
        // Try to delete the orphaned auth user
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
        if (deleteError) {
          console.error('🔥 Failed to cleanup orphaned auth user:', deleteError)
          return new Response(
            JSON.stringify({ 
              error: 'Email cleanup required',
              details: `The email ${email} has an orphaned authentication record that needs manual cleanup. Please contact support or try again in a few minutes.`,
              errorCode: 'ORPHANED_AUTH_RECORD',
              orphanedUserId: existingAuthUser.id
            }),
            { 
              status: 422, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        } else {
          console.log('🔥 Successfully cleaned up orphaned auth user')
        }
      }
    }

    // Create user with admin privileges (doesn't affect current session)
    console.log('🔥 Creating new user account')
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email to avoid email verification
      user_metadata: {
        full_name: fullName,
        role: role || 'client'
      }
    })

    if (userError) {
      console.error('🔥 Error creating user:', userError)
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Failed to create user account'
      let errorDetails = userError.message
      let errorCode = 'USER_CREATION_FAILED'
      
      if (userError.message?.includes('already been registered') || userError.message?.includes('email')) {
        errorMessage = 'Email already registered'
        errorDetails = `The email ${email} is already registered in the authentication system. This could be from a recently deleted user that hasn't been fully cleaned up. Please wait a few minutes and try again, or use a different email address.`
        errorCode = 'EMAIL_ALREADY_REGISTERED'
      } else if (userError.message?.includes('password')) {
        errorMessage = 'Invalid password'
        errorDetails = 'Password does not meet security requirements'
        errorCode = 'INVALID_PASSWORD'
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: errorDetails,
          errorCode,
          originalError: userError.message,
          suggestion: errorCode === 'EMAIL_ALREADY_REGISTERED' ? 
            'Please wait 5-10 minutes for the system to fully cleanup deleted accounts, then try again.' : 
            'Please check the input and try again.'
        }),
        { 
          status: 422, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('🔥 User created successfully:', userData.user?.id)
    return new Response(
      JSON.stringify({ 
        user: userData.user,
        success: true,
        message: 'Portal user created successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('🔥 Unexpected edge function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'An unexpected error occurred while creating the user account',
        errorCode: 'INTERNAL_ERROR',
        originalError: error.message,
        suggestion: 'Please try again in a few minutes. If the problem persists, contact support.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
