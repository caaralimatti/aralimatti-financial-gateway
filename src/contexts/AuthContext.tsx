
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

  const fetchProfile = useCallback(async (userId: string) => {
    // Skip if we already have this user's profile cached
    if (currentUserId.current === userId && profileCache.current) {
      console.log('Using cached profile for user:', userId);
      setProfile(profileCache.current);
      return;
    }

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
        profileCache.current = null;
        return;
      }
      
      console.log('Profile fetched:', data);
      setProfile(data);
      profileCache.current = data;
      currentUserId.current = userId;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
      profileCache.current = null;
    }
  }, []);

  const validateUserSession = useCallback(async (newSession: Session | null) => {
    if (!newSession?.user) {
      setUser(null);
      setProfile(null);
      profileCache.current = null;
      currentUserId.current = null;
      return;
    }

    // Only update user if it's actually different
    if (!user || user.id !== newSession.user.id) {
      setUser(newSession.user);
    }
    
    await fetchProfile(newSession.user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;
    
    console.log('Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        // Update session immediately
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to prevent potential auth callback issues
          setTimeout(() => {
            if (mounted) {
              validateUserSession(session);
            }
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
          profileCache.current = null;
          currentUserId.current = null;
        }
        
        if (isInitialized.current) {
          setLoading(false);
        }
      }
    );

    // Check for existing session only once on mount
    if (!isInitialized.current) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!mounted) return;
        
        console.log('Initial session check:', session?.user?.id);
        setSession(session);
        if (session?.user) {
          validateUserSession(session);
        }
        setLoading(false);
        isInitialized.current = true;
      });
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove validateUserSession from dependencies to prevent re-initialization

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

    // Simplified validation after successful sign in
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
    
    // Clear cache immediately
    profileCache.current = null;
    currentUserId.current = null;
    
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
