
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserRole } from '@/types/auth';
import { useProfileManager } from '@/hooks/useProfileManager';
import { authOperations } from '@/services/authOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use profile manager hook
  const { profile, fetchProfile, clearProfile } = useProfileManager();
  
  // Use refs to track state and prevent unnecessary setups
  const isInitialized = useRef(false);
  const subscriptionRef = useRef<any>(null);

  // Remove the validateUserSession function that was causing recursion
  // Instead, just fetch profile when user changes
  const handleUserChange = useCallback(async (newUser: User | null) => {
    if (newUser && (!user || user.id !== newUser.id)) {
      console.log('🔥 New user detected, fetching profile:', newUser.id);
      setUser(newUser);
      // Use setTimeout to prevent blocking the auth callback
      setTimeout(() => {
        fetchProfile(newUser.id);
      }, 0);
    } else if (!newUser) {
      console.log('🔥 No user, clearing state');
      setUser(null);
      clearProfile();
    }
  }, [user?.id, fetchProfile, clearProfile]); // Only depend on user ID

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) {
      console.log('🔥 AuthContext already initialized, skipping');
      return;
    }

    let mounted = true;
    console.log('🔥 Setting up auth state listener (ONCE)...');
    
    // Clean up any existing subscription
    if (subscriptionRef.current) {
      console.log('🔥 Cleaning up existing subscription');
      subscriptionRef.current.unsubscribe();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔥 Auth State Change Event:', event);
        console.log('🔥 Session Object:', session);
        
        if (!mounted) {
          console.log('🔥 Component unmounted, skipping auth state change');
          return;
        }
        
        try {
          // Update session state
          setSession(session);
          
          // Handle user change with deferred profile fetching
          if (session?.user) {
            handleUserChange(session.user);
          } else {
            handleUserChange(null);
          }
          
          setLoading(false);
        } catch (error) {
          console.error('🔥 ERROR in auth state change handler:', error);
          setLoading(false);
        }
      }
    );

    subscriptionRef.current = subscription;

    // Check for existing session only once
    console.log('🔥 Checking initial session...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('🔥 Initial session check:', session?.user?.id);
      setSession(session);
      if (session?.user) {
        handleUserChange(session.user);
      } else {
        setLoading(false);
      }
    }).catch((error) => {
      console.error('🔥 ERROR in initial session check:', error);
      setLoading(false);
    });

    isInitialized.current = true;

    return () => {
      console.log('🔥 Cleaning up auth state listener...');
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []); // Empty dependency array to prevent re-initialization

  // Wrap auth operations with profile cache clearing
  const signOut = useCallback(async () => {
    clearProfile();
    await authOperations.signOut();
  }, [clearProfile]);

  // Enhanced logging for super admin debugging
  useEffect(() => {
    if (profile) {
      console.log('🔥 AuthContext - Profile loaded:', {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        is_active: profile.is_active
      });
      
      if (profile.role === 'super_admin') {
        console.log('🔥 SUPER ADMIN detected in AuthContext!');
      }
    }
  }, [profile]);

  // Memoize the context value with stable references
  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signIn: authOperations.signIn,
    signUp: authOperations.signUp,
    signOut,
    resetPassword: authOperations.resetPassword,
  }), [user, profile, session, loading, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
