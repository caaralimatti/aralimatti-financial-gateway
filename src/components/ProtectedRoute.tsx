
import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';

type UserRole = 'client' | 'staff' | 'admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = memo(({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/auth' 
}) => {
  const { user, profile, loading } = useAuth();
  
  console.log('🔥 ProtectedRoute render - User:', user?.id, 'Profile:', profile?.id, 'Loading:', loading);
  
  // Use the auth guard to continuously validate user access (but much less aggressively now)
  useAuthGuard();

  if (loading) {
    console.log('🔥 ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile) {
    console.log('🔥 ProtectedRoute: No user or profile, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  // Check if profile is active
  if (!profile.is_active) {
    console.log('🔥 ProtectedRoute: Profile inactive, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    console.log('🔥 ProtectedRoute: Role not allowed, redirecting to unauthorized');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('🔥 ProtectedRoute: Access granted, rendering children');
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
