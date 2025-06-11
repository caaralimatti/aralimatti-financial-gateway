
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

  const validateUserSession = useCallback(async (newSession: Session | null) => {
    console.log('🔥 validateUserSession called with session:', newSession?.user?.id);
    
    if (!newSession?.user) {
      console.log('🔥 No session/user, clearing state');
      setUser(null);
      clearProfile();
      return;
    }

    // Only update user if it's actually different
    if (!user || user.id !== newSession.user.id) {
      console.log('🔥 Setting new user:', newSession.user.id);
      setUser(newSession.user);
    }
    
    await fetchProfile(newSession.user.id);
  }, [user, fetchProfile, clearProfile]);

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
      async (event, session) => {
        console.log('🔥 Auth State Change Event:', event);
        console.log('🔥 Session Object:', session);
        console.log('🔥 Current URL:', window.location.href);
        console.log('🔥 Mounted state:', mounted);
        console.log('🔥 User ID from session:', session?.user?.id);
        
        if (!mounted) {
          console.log('🔥 Component unmounted, skipping auth state change');
          return;
        }
        
        try {
          console.log('🔥 Updating session state...');
          setSession(session);
          
          if (session?.user) {
            console.log('🔥 Session exists, validating user...');
            // Use setTimeout to prevent potential auth callback issues
            setTimeout(() => {
              if (mounted) {
                console.log('🔥 Calling validateUserSession...');
                validateUserSession(session);
              }
            }, 0);
          } else {
            console.log('🔥 No session, clearing user state...');
            setUser(null);
            clearProfile();
          }
          
          console.log('🔥 Setting loading to false...');
          setLoading(false);
        } catch (error) {
          console.error('🔥 ERROR in auth state change handler:', error);
          setLoading(false);
        }
        
        console.log('🔥 Auth state change handler completed');
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
        validateUserSession(session);
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
  }, []); // Keep empty dependency array but ensure single initialization

  // Wrap auth operations with profile cache clearing
  const signOut = useCallback(async () => {
    clearProfile();
    await authOperations.signOut();
  }, [clearProfile]);

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
