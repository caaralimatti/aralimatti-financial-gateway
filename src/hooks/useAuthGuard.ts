
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export const useAuthGuard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const hasShownToast = useRef(false);
  const isValidating = useRef(false);
  const lastValidationTime = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const validateUserAccess = async () => {
      if (!user || isValidating.current) return;

      // Debounce validation - only run once every 30 minutes
      const now = Date.now();
      if (now - lastValidationTime.current < 1800000) { // 30 minutes
        return;
      }

      isValidating.current = true;
      lastValidationTime.current = now;
      console.log('🔥 Auth guard: Validating user access for:', user.id);
      
      try {
        const validation = await authService.validateUserAccess(user.id);
        
        if (!validation.isValid) {
          console.log('🔥 Auth guard: User access invalid:', validation.reason);
          
          // Only show toast once per session
          if (!hasShownToast.current) {
            toast({
              title: "Access Denied",
              description: validation.reason || "Your account is currently inactive. Please contact your administrator.",
              variant: "destructive",
            });
            hasShownToast.current = true;
          }

          // Sign out the user - DO NOT use window.location methods
          console.log('🔥 Auth guard: Signing out user due to invalid access');
          await signOut();
        } else {
          console.log('🔥 Auth guard: User access validated successfully');
          // Reset the toast flag if user becomes valid again
          hasShownToast.current = false;
        }
      } catch (error) {
        console.error('🔥 Auth guard: Error during validation:', error);
        
        // Only show error toast once
        if (!hasShownToast.current) {
          toast({
            title: "Authentication Error",
            description: "There was an error validating your account. Please try logging in again.",
            variant: "destructive",
          });
          hasShownToast.current = true;
        }

        console.log('🔥 Auth guard: Signing out user due to validation error');
        await signOut();
      } finally {
        isValidating.current = false;
      }
    };

    // Only run validation if user exists
    if (user) {
      console.log('🔥 Auth guard: Setting up validation for user:', user.id);
      
      // Run validation immediately on mount (with debounce)
      validateUserAccess();
      
      // Set up interval for periodic validation (every 45 minutes - even less aggressive)
      intervalRef.current = setInterval(() => {
        console.log('🔥 Auth guard: Periodic validation triggered');
        validateUserAccess();
      }, 2700000); // 45 minutes
      
      return () => {
        console.log('🔥 Auth guard: Cleaning up interval');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        isValidating.current = false;
      };
    }

    // Reset state when user logs out
    return () => {
      console.log('🔥 Auth guard: User logged out, cleaning up');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isValidating.current = false;
      hasShownToast.current = false;
    };
  }, [user?.id, signOut, toast]); // Only depend on user ID, not the entire user object
};
