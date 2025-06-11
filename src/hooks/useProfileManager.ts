
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const useProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const currentUserId = useRef<string | null>(null);
  const profileCache = useRef<Profile | null>(null);

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

  const clearProfile = useCallback(() => {
    setProfile(null);
    profileCache.current = null;
    currentUserId.current = null;
  }, []);

  return {
    profile,
    fetchProfile,
    clearProfile,
    setProfile
  };
};
