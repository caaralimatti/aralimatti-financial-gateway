
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export const useAuthGuard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const hasShownToast = useRef(false);
  const isValidating = useRef(false);
  const lastValidationTime = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Always clear any existing intervals first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Don't run auth guard on auth pages to prevent infinite loops
    if (location.pathname === '/auth' || location.pathname === '/reset-password') {
      console.log('🔥 Auth guard: Skipping validation on auth page');
      isValidating.current = false;
      hasShownToast.current = false;
      return;
    }

    // Don't run validation if there's no user at all - this is critical
    if (!user) {
      console.log('🔥 Auth guard: No user, skipping all validation');
      isValidating.current = false;
      hasShownToast.current = false;
      return;
    }

    // Only proceed if we have a valid user and we're not on auth pages
    console.log('🔥 Auth guard: Setting up validation for user:', user.id);

    const validateUserAccess = async () => {
      // Triple check user exists and we're not already validating
      if (!user || isValidating.current) {
        console.log('🔥 Auth guard: Skipping validation - no user or already validating');
        return;
      }

      // Debounce validation - only run once every 30 minutes
      const now = Date.now();
      if (now - lastValidationTime.current < 1800000) { // 30 minutes
        console.log('🔥 Auth guard: Skipping validation - too soon since last check');
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

          // Clear interval before signing out to prevent further validations
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          // Sign out the user
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

        // Clear interval before signing out
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        console.log('🔥 Auth guard: Signing out user due to validation error');
        await signOut();
      } finally {
        isValidating.current = false;
      }
    };

    // Run validation immediately on mount (with debounce)
    validateUserAccess();
    
    // Set up interval for periodic validation (every 45 minutes)
    intervalRef.current = setInterval(() => {
      console.log('🔥 Auth guard: Periodic validation triggered');
      // Always check if user still exists before validation
      if (user && user.id) {
        validateUserAccess();
      } else {
        console.log('🔥 Auth guard: User no longer exists, clearing interval');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 2700000); // 45 minutes
    
    return () => {
      console.log('🔥 Auth guard: Cleaning up interval for user:', user.id);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isValidating.current = false;
    };
  }, [user?.id, signOut, toast, location.pathname]);

  // Cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      console.log('🔥 Auth guard: Component unmounting, final cleanup');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isValidating.current = false;
      hasShownToast.current = false;
    };
  }, []);
};
