
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const WelcomeToast = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const hasShownWelcome = useRef(false);

  useEffect(() => {
    // Only show welcome toast once when user first logs in
    if (user && profile && !hasShownWelcome.current) {
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      hasShownWelcome.current = true;
    }

    // Reset when user logs out
    if (!user) {
      hasShownWelcome.current = false;
    }
  }, [user?.id, profile?.id, toast]); // Only depend on IDs to prevent excessive re-renders

  return null; // This component doesn't render anything
};

export default WelcomeToast;
