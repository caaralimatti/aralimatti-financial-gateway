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
    console.log('🔥 Starting Gmail test with improved error handling');
    
    // Get OAuth credentials from environment
    const clientId = Deno.env.get('GMAIL_CLIENT_ID');
    const clientSecret = Deno.env.get('GMAIL_CLIENT_SECRET');
    const refreshToken = Deno.env.get('GMAIL_REFRESH_TOKEN');
    let accessToken = Deno.env.get('GMAIL_ACCESS_TOKEN');
    
    console.log('🔥 Checking OAuth credentials...');
    console.log('🔥 Client ID available:', !!clientId);
    console.log('🔥 Client Secret available:', !!clientSecret);
    console.log('🔥 Refresh Token available:', !!refreshToken);
    console.log('🔥 Access Token available:', !!accessToken);
    
    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing Gmail OAuth credentials. Please check your Supabase secrets.');
    }
    
    // Function to refresh access token with better error handling
    const refreshAccessToken = async () => {
      console.log('🔥 Attempting to refresh access token...');
      
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });
      
      console.log('🔥 Request params prepared, making request to Google OAuth...');
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      
      const responseText = await response.text();
      console.log('🔥 Google OAuth response status:', response.status);
      console.log('🔥 Google OAuth response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Failed to refresh access token: ${response.status} - ${responseText}`);
      }
      
      const data = JSON.parse(responseText);
      console.log('🔥 Access token refreshed successfully');
      return data.access_token;
    };
    
    // Function to send email via Gmail API with better error handling
    const sendEmail = async (token: string) => {
      console.log('🔥 Preparing test email content...');
      
      const to = 'prabhudev@example.com'; // You can update this with real email
      const subject = '🌟 Gmail API Test - You are the Best Staff! 🌟';
      const message = `Dear Prabhudev,

This is a test email from our Gmail API integration!

🎉 Congratulations! You are officially the BEST staff member! 🎉

Your dedication and hard work are truly appreciated by everyone on the team.

Key achievements:
✅ Outstanding performance
✅ Great team collaboration  
✅ Excellent problem-solving skills
✅ Positive attitude that inspires others

Keep up the amazing work!

Best regards,
The Management Team

---
📧 This email was sent via Gmail API integration test
⏰ Sent at: ${new Date().toISOString()}
🔧 System: Automated email testing`;
      
      // Create email content in RFC 2822 format
      const emailContent = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        '',
        message
      ].join('\r\n');
      
      // Encode in base64url format (required by Gmail API)
      // Use TextEncoder to handle Unicode characters properly
      const encoder = new TextEncoder();
      const emailBytes = encoder.encode(emailContent);
      const base64Email = btoa(String.fromCharCode(...emailBytes))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      console.log('🔥 Email content prepared, sending via Gmail API...');
      
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
      
      const responseText = await response.text();
      console.log('🔥 Gmail API response status:', response.status);
      console.log('🔥 Gmail API response:', responseText);
      
      if (!response.ok) {
        throw new Error(`Gmail API error: ${response.status} - ${responseText}`);
      }
      
      return JSON.parse(responseText);
    };
    
    let emailResponse;
    
    try {
      // Try with current access token first
      console.log('🔥 Attempting to send email with current access token...');
      emailResponse = await sendEmail(accessToken);
      console.log('🔥 Email sent successfully with existing token!');
    } catch (error) {
      console.log('🔥 Current access token failed, attempting to refresh...');
      console.log('🔥 Error details:', error.message);
      
      try {
        // If it fails, refresh the token and try again
        accessToken = await refreshAccessToken();
        console.log('🔥 Token refreshed, retrying email send...');
        emailResponse = await sendEmail(accessToken);
        console.log('🔥 Email sent successfully with refreshed token!');
      } catch (refreshError) {
        console.error('🔥 Token refresh failed:', refreshError.message);
        throw new Error(`Token refresh failed: ${refreshError.message}`);
      }
    }
    
    const successResponse = {
      success: true,
      messageId: emailResponse.id,
      message: '🎉 Test email sent successfully to Prabhudev via Gmail API!',
      recipient: 'prabhudev@example.com',
      subject: '🌟 Gmail API Test - You are the Best Staff! 🌟',
      timestamp: new Date().toISOString(),
      tokenRefreshed: accessToken !== Deno.env.get('GMAIL_ACCESS_TOKEN')
    };
    
    console.log('🔥 Gmail test completed successfully:', successResponse);
    
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
    
  } catch (error: any) {
    console.error('🔥 Gmail test failed with error:', error.message);
    console.error('🔥 Full error details:', error);
    
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      troubleshooting: {
        'invalid_client': 'Check if Gmail Client ID and Secret are correctly set in Supabase secrets',
        'invalid_grant': 'Refresh token may be expired - regenerate OAuth credentials',
        'insufficient_scope': 'Make sure Gmail API scope includes send permissions',
        'quota_exceeded': 'Gmail API quota may be exceeded'
      }
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json', 
        ...corsHeaders 
      },
    });
  }
};

serve(handler);