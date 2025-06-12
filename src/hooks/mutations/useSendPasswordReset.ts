
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { adminActivityService } from '@/services/adminActivityService';

export const useSendPasswordReset = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      await authService.sendPasswordResetEmail(email);
      
      // Log the activity
      await adminActivityService.logActivity(
        'password_reset_sent',
        `Sent password reset email to: ${email}`,
        { email }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
      toast({
        title: "Success",
        description: "Password reset email sent successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error sending reset email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email.",
        variant: "destructive",
      });
    }
  });
};
