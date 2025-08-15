import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

interface GmailTestResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
  recipient?: string;
  subject?: string;
  timestamp?: string;
  tokenRefreshed?: boolean;
}

const GmailTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<GmailTestResponse | null>(null);
  const { toast } = useToast();

  const handleGmailTest = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔥 Starting Gmail API test...');
      
      const { data, error } = await supabase.functions.invoke('send-gmail-test-fixed', {
        body: {}
      });

      if (error) {
        console.error('🔥 Supabase function error:', error);
        throw error;
      }

      console.log('🔥 Gmail test response:', data);
      setLastResult(data);

      if (data.success) {
        toast({
          title: "Gmail Test Successful! 🎉",
          description: `Email sent to Prabhudev successfully. Message ID: ${data.messageId}`,
        });
      } else {
        toast({
          title: "Gmail Test Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('🔥 Gmail test error:', error);
      
      const errorResult: GmailTestResponse = {
        success: false,
        error: error.message || 'Unknown error occurred',
        timestamp: new Date().toISOString()
      };
      
      setLastResult(errorResult);
      
      toast({
        title: "Gmail Test Failed",
        description: error.message || "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail API Test
        </CardTitle>
        <CardDescription>
          Test the Gmail API integration by sending a congratulatory email to Prabhudev
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGmailTest}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Sending Test Email...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Send Test Email to Prabhudev
            </>
          )}
        </Button>

        {lastResult && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              {lastResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-semibold">
                {lastResult.success ? 'Test Successful' : 'Test Failed'}
              </span>
              <Badge variant={lastResult.success ? 'default' : 'destructive'}>
                {lastResult.success ? 'SUCCESS' : 'ERROR'}
              </Badge>
            </div>

            {lastResult.success ? (
              <div className="space-y-2 text-sm">
                <div><strong>Message ID:</strong> {lastResult.messageId}</div>
                <div><strong>Recipient:</strong> {lastResult.recipient}</div>
                <div><strong>Subject:</strong> {lastResult.subject}</div>
                <div><strong>Timestamp:</strong> {lastResult.timestamp}</div>
                {lastResult.tokenRefreshed && (
                  <Badge variant="secondary" className="mt-2">
                    Token Refreshed
                  </Badge>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="text-red-600">
                  <strong>Error:</strong> {lastResult.error}
                </div>
                <div><strong>Timestamp:</strong> {lastResult.timestamp}</div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          <p><strong>What this test does:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Validates Gmail OAuth credentials</li>
            <li>Tests access token refresh mechanism</li>
            <li>Sends a congratulatory email to Prabhudev</li>
            <li>Provides detailed success/error feedback</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GmailTestButton;