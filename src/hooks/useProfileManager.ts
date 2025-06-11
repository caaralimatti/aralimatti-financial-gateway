
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';

export const useProfileManager = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const currentUserId = useRef<string | null>(null);
  const profileCache = useRef<Profile | null>(null);
  const isFetching = useRef(false);

  const fetchProfile = useCallback(async (userId: string) => {
    // Skip if we already have this user's profile cached
    if (currentUserId.current === userId && profileCache.current) {
      console.log('🔥 Using cached profile for user:', userId);
      setProfile(profileCache.current);
      return;
    }

    // Prevent concurrent fetches for the same user
    if (isFetching.current) {
      console.log('🔥 Already fetching profile, skipping');
      return;
    }

    try {
      isFetching.current = true;
      console.log('🔥 Fetching profile for user:', userId);
      
      // Use select without .maybeSingle() to avoid the problematic Accept header
      // Instead, we'll handle the array response and take the first item
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .limit(1);

      if (error) {
        console.error('🔥 Error fetching profile:', error);
        setProfile(null);
        profileCache.current = null;
        return;
      }
      
      // Handle the array response - take first item or null if empty
      const profileData = data && data.length > 0 ? data[0] : null;
      
      console.log('🔥 Profile fetched successfully:', profileData);
      setProfile(profileData);
      profileCache.current = profileData;
      currentUserId.current = userId;
    } catch (error) {
      console.error('🔥 Error in fetchProfile:', error);
      setProfile(null);
      profileCache.current = null;
    } finally {
      isFetching.current = false;
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    profileCache.current = null;
    currentUserId.current = null;
    isFetching.current = false;
  }, []);

  return {
    profile,
    fetchProfile,
    clearProfile,
    setProfile
  };
};
