
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async validateUserAccess(userId: string) {
    console.log('🔥 Validating user access for:', userId);
    
    try {
      // Use select without .maybeSingle() to avoid problematic Accept header
      const { data, error } = await supabase
        .from('profiles')
        .select('is_active')
        .eq('id', userId)
        .limit(1);

      if (error) {
        console.error('🔥 Error validating user access:', error);
        return { isValid: false, reason: 'Database error' };
      }

      // Handle array response
      const profile = data && data.length > 0 ? data[0] : null;
      
      if (!profile) {
        console.log('🔥 No profile found for user');
        return { isValid: false, reason: 'Profile not found' };
      }

      if (!profile.is_active) {
        console.log('🔥 User account is inactive');
        return { isValid: false, reason: 'Account is inactive' };
      }

      console.log('🔥 User access validated successfully');
      return { isValid: true };
    } catch (error) {
      console.error('🔥 Error in validateUserAccess:', error);
      return { isValid: false, reason: 'Validation failed' };
    }
  }
};
