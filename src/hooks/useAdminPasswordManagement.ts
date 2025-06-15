
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminPasswordManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const sendPasswordReset = async (clientEmail: string) => {
    if (!profile?.id) {
      throw new Error('Admin not authenticated');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-password-reset', {
        body: {
          clientEmail,
          action: 'reset',
          adminId: profile.id
        }
      });

      if (error) throw error;

      toast({
        title: "Password Reset Sent",
        description: `Password reset email has been sent to ${clientEmail}`,
      });

      return data;
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateTempPassword = async (clientId: string) => {
    if (!profile?.id) {
      throw new Error('Admin not authenticated');
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-temp-password', {
        body: {
          clientId,
          adminId: profile.id
        }
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error('Error generating temporary password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate temporary password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendPasswordReset,
    generateTempPassword,
    isLoading
  };
};
