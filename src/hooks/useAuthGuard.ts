
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export const useAuthGuard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const validateUserAccess = async () => {
      if (!user) return;

      console.log('Auth guard: Validating user access for:', user.id);
      
      try {
        const validation = await authService.validateUserAccess(user.id);
        
        if (!validation.isValid) {
          console.log('Auth guard: User access invalid:', validation.reason);
          
          toast({
            title: "Access Denied",
            description: validation.reason || "Your account is currently inactive. Please contact your administrator.",
            variant: "destructive",
          });

          // Sign out the user
          await signOut();
        } else {
          console.log('Auth guard: User access validated successfully');
        }
      } catch (error) {
        console.error('Auth guard: Error during validation:', error);
        
        toast({
          title: "Authentication Error",
          description: "There was an error validating your account. Please try logging in again.",
          variant: "destructive",
        });

        await signOut();
      }
    };

    // Run validation immediately and then every 30 seconds
    validateUserAccess();
    const interval = setInterval(validateUserAccess, 30000);

    return () => clearInterval(interval);
  }, [user, signOut, toast]);
};
