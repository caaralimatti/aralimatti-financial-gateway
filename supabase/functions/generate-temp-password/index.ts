
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const generateSecurePassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
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

    const { clientId, adminId } = await req.json()
    
    // Generate secure temporary password
    const tempPassword = generateSecurePassword(16)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Get client profile
    const { data: clientProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('email, full_name')
      .eq('id', clientId)
      .single()

    if (profileError || !clientProfile) {
      return new Response(
        JSON.stringify({ error: 'Client not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update user's password in auth system
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      clientId,
      { password: tempPassword }
    )

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store temporary password info in profiles
    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .update({
        temporary_password_hash: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tempPassword)).then(hash => 
          Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
        ),
        temp_password_expires_at: expiresAt.toISOString()
      })
      .eq('id', clientId)

    if (profileUpdateError) {
      console.error('Error updating profile with temp password info:', profileUpdateError)
    }

    // Log admin activity
    await supabaseAdmin
      .from('admin_activity_log')
      .insert({
        user_id: adminId,
        activity_type: 'TEMP_PASSWORD_GENERATED',
        description: `Admin generated temporary password for client: ${clientProfile.email}`,
        metadata: { 
          client_id: clientId,
          client_email: clientProfile.email,
          expires_at: expiresAt.toISOString()
        }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        tempPassword,
        clientEmail: clientProfile.email,
        clientName: clientProfile.full_name,
        expiresAt: expiresAt.toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
