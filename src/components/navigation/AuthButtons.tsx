
import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface AuthButtonsProps {
  getDashboardLink: () => string;
  className?: string;
}

const AuthButtons = memo(({ getDashboardLink, className = '' }: AuthButtonsProps) => {
  const { user, signOut } = useAuth();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut]);

  if (user) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Link to={getDashboardLink()}>
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Dashboard
          </Button>
        </Link>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="text-neutral-700 hover:text-primary"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Link to="/auth">
      <Button
        variant="outline"
        size="sm"
        className={`border-primary text-primary hover:bg-primary hover:text-white ${className}`}
      >
        Login
      </Button>
    </Link>
  );
});

AuthButtons.displayName = 'AuthButtons';

export default AuthButtons;
