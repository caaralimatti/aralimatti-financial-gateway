
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
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

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }
      
      console.log('Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
    }
  }, []);

  const validateUserSession = useCallback(async (newSession: Session | null) => {
    if (!newSession?.user) {
      setUser(null);
      setProfile(null);
      return;
    }

    // First set the user and fetch profile
    setUser(newSession.user);
    await fetchProfile(newSession.user.id);

    // Then validate access (but don't show toast here - let useAuthGuard handle it)
    try {
      const validation = await authService.validateUserAccess(newSession.user.id);
      
      if (!validation.isValid) {
        console.log('User session invalid during auth state change:', validation.reason);
        
        // Sign out the user silently
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
        return;
      }
    } catch (error) {
      console.error('Error validating user session:', error);
    }
  }, [fetchProfile]);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid potential deadlocks in auth callbacks
          setTimeout(() => {
            validateUserSession(session);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      if (session?.user) {
        validateUserSession(session);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [validateUserSession]);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }

    // Additional validation after successful sign in
    if (data.user) {
      const validation = await authService.validateUserAccess(data.user.id);
      
      if (!validation.isValid) {
        console.log('User access denied after sign in:', validation.reason);
        await supabase.auth.signOut();
        throw new Error(validation.reason || 'Account is inactive');
      }
    }

    console.log('Sign in successful');
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string, role: UserRole = 'client') => {
    console.log('Attempting to sign up with:', { email, fullName, role });
    
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
      console.error('Sign up error:', error);
      throw error;
    }

    console.log('Sign up successful:', data);
  }, []);

  const signOut = useCallback(async () => {
    console.log('Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    console.log('Sign out successful');
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    console.log('Resetting password for:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Reset password error:', error);
      throw error;
    }
    console.log('Reset password email sent');
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
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
