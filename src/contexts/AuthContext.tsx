
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/authService';

type UserRole = 'client' | 'staff' | 'admin';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use refs to track state and prevent unnecessary fetches
  const currentUserId = useRef<string | null>(null);
  const profileCache = useRef<Profile | null>(null);
  const isInitialized = useRef(false);
  const subscriptionRef = useRef<any>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    // Skip if we already have this user's profile cached
    if (currentUserId.current === userId && profileCache.current) {
      console.log('🔥 Using cached profile for user:', userId);
      setProfile(profileCache.current);
      return;
    }

    try {
      console.log('🔥 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('🔥 Error fetching profile:', error);
        setProfile(null);
        profileCache.current = null;
        return;
      }
      
      console.log('🔥 Profile fetched:', data);
      setProfile(data);
      profileCache.current = data;
      currentUserId.current = userId;
    } catch (error) {
      console.error('🔥 Error in fetchProfile:', error);
      setProfile(null);
      profileCache.current = null;
    }
  }, []);

  const validateUserSession = useCallback(async (newSession: Session | null) => {
    console.log('🔥 validateUserSession called with session:', newSession?.user?.id);
    
    if (!newSession?.user) {
      console.log('🔥 No session/user, clearing state');
      setUser(null);
      setProfile(null);
      profileCache.current = null;
      currentUserId.current = null;
      return;
    }

    // Only update user if it's actually different
    if (!user || user.id !== newSession.user.id) {
      console.log('🔥 Setting new user:', newSession.user.id);
      setUser(newSession.user);
    }
    
    await fetchProfile(newSession.user.id);
  }, [user, fetchProfile]);

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
            setProfile(null);
            profileCache.current = null;
            currentUserId.current = null;
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

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('🔥 Attempting to sign in with:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔥 Sign in error:', error);
        throw error;
      }

      // Simplified validation after successful sign in
      if (data.user) {
        console.log('🔥 Sign in successful, validating user access...');
        const validation = await authService.validateUserAccess(data.user.id);
        
        if (!validation.isValid) {
          console.log('🔥 User access denied after sign in:', validation.reason);
          await supabase.auth.signOut();
          throw new Error(validation.reason || 'Account is inactive');
        }
      }

      console.log('🔥 Sign in completed successfully');
    } catch (error) {
      console.error('🔥 Sign in process failed:', error);
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string, role: UserRole = 'client') => {
    console.log('🔥 Attempting to sign up with:', { email, fullName, role });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        console.error('🔥 Sign up error:', error);
        throw error;
      }

      console.log('🔥 Sign up successful:', data);
    } catch (error) {
      console.error('🔥 Sign up process failed:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log('🔥 Signing out...');
    
    try {
      // Clear cache immediately
      profileCache.current = null;
      currentUserId.current = null;
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('🔥 Sign out error:', error);
        throw error;
      }
      console.log('🔥 Sign out successful');
    } catch (error) {
      console.error('🔥 Sign out process failed:', error);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    console.log('🔥 Resetting password for:', email);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('🔥 Reset password error:', error);
        throw error;
      }
      console.log('🔥 Reset password email sent');
    } catch (error) {
      console.error('🔥 Reset password process failed:', error);
      throw error;
    }
  }, []);

  // Memoize the context value with stable references
  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }), [user, profile, session, loading, signIn, signUp, signOut, resetPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
