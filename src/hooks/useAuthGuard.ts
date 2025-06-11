
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export const useAuthGuard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const hasShownToast = useRef(false);
  const isValidating = useRef(false);

  useEffect(() => {
    const validateUserAccess = async () => {
      if (!user || isValidating.current) return;

      isValidating.current = true;
      console.log('Auth guard: Validating user access for:', user.id);
      
      try {
        const validation = await authService.validateUserAccess(user.id);
        
        if (!validation.isValid) {
          console.log('Auth guard: User access invalid:', validation.reason);
          
          // Only show toast once per session
          if (!hasShownToast.current) {
            toast({
              title: "Access Denied",
              description: validation.reason || "Your account is currently inactive. Please contact your administrator.",
              variant: "destructive",
            });
            hasShownToast.current = true;
          }

          // Sign out the user
          await signOut();
        } else {
          console.log('Auth guard: User access validated successfully');
          // Reset the toast flag if user becomes valid again
          hasShownToast.current = false;
        }
      } catch (error) {
        console.error('Auth guard: Error during validation:', error);
        
        // Only show error toast once
        if (!hasShownToast.current) {
          toast({
            title: "Authentication Error",
            description: "There was an error validating your account. Please try logging in again.",
            variant: "destructive",
          });
          hasShownToast.current = true;
        }

        await signOut();
      } finally {
        isValidating.current = false;
      }
    };

    // Only run validation if user exists
    if (user) {
      // Run validation immediately on mount
      validateUserAccess();
      
      // Set up interval for periodic validation (every 5 minutes instead of 30 seconds)
      const interval = setInterval(validateUserAccess, 300000); // 5 minutes
      
      return () => {
        clearInterval(interval);
        isValidating.current = false;
      };
    }
  }, [user?.id, signOut, toast]); // Only depend on user ID, not the entire user object
};
