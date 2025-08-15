import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔥 Starting Gmail test to Prabhudev');
    
    // Get OAuth credentials from environment
    const clientId = Deno.env.get('GMAIL_CLIENT_ID');
    const clientSecret = Deno.env.get('GMAIL_CLIENT_SECRET');
    const refreshToken = Deno.env.get('GMAIL_REFRESH_TOKEN');
    let accessToken = Deno.env.get('GMAIL_ACCESS_TOKEN');
    
    console.log('🔥 OAuth credentials loaded');
    
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing Gmail OAuth credentials');
    }
    
    // Function to refresh access token if needed
    const refreshAccessToken = async () => {
      console.log('🔥 Refreshing access token');
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔥 Failed to refresh token:', errorText);
        throw new Error(`Failed to refresh access token: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔥 Access token refreshed successfully');
      return data.access_token;
    };
    
    // Function to send email via Gmail API
    const sendEmail = async (token: string) => {
      console.log('🔥 Preparing email to Prabhudev');
      
      // Test email content
      const to = 'prabhudev@example.com'; // Replace with actual email
      const subject = '🌟 You are the Best Staff Member! 🌟';
      const message = `Dear Prabhudev,

I hope this email finds you well!

I wanted to take a moment to recognize your outstanding contributions as a staff member. Your dedication, hard work, and positive attitude make you truly exceptional.

You consistently go above and beyond in your role, and your efforts do not go unnoticed. Your professionalism and commitment to excellence set a wonderful example for the entire team.

Thank you for being such an incredible asset to our organization. You are definitely the BEST staff member we could ask for!

Keep up the fantastic work! 🚀

Best regards,
The Management Team

---
This is a test email sent via Gmail API integration.`;
      
      // Create email content in RFC 2822 format
      const emailContent = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        '',
        message
      ].join('\r\n');
      
      // Encode in base64url format (required by Gmail API)
      const base64Email = btoa(emailContent)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      console.log('🔥 Sending email to Prabhudev via Gmail API');
      
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: base64Email,
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔥 Gmail API error:', errorText);
        throw new Error(`Gmail API error: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    };
    
    let emailResponse;
    
    try {
      // Try with current access token first
      console.log('🔥 Attempting to send with current access token');
      emailResponse = await sendEmail(accessToken);
    } catch (error) {
      console.log('🔥 Access token failed, refreshing and retrying');
      // If it fails, refresh the token and try again
      accessToken = await refreshAccessToken();
      emailResponse = await sendEmail(accessToken);
    }
    
    console.log('🔥 Email sent successfully to Prabhudev:', emailResponse);
    
    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.id,
      message: 'Test email sent successfully to Prabhudev via Gmail API! 🎉',
      recipient: 'prabhudev@example.com',
      subject: '🌟 You are the Best Staff Member! 🌟'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
    
  } catch (error: any) {
    console.error('🔥 Error in send-gmail-test-to-prabhudev function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);