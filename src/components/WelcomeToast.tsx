
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const WelcomeToast = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const hasShownWelcome = useRef(false);
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    // Only show welcome toast once per unique login session
    if (user && profile && user.id !== lastUserId.current && !hasShownWelcome.current) {
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      hasShownWelcome.current = true;
      lastUserId.current = user.id;
    }

    // Reset when user logs out
    if (!user) {
      hasShownWelcome.current = false;
      lastUserId.current = null;
    }
  }, [user?.id, profile?.id, toast]); // Only depend on IDs to prevent excessive re-renders

  return null; // This component doesn't render anything
};

export default WelcomeToast;
