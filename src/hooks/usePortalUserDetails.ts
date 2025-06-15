
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePortalUserDetails = (portalUserId?: string | null) => {
  return useQuery({
    queryKey: ['portal-user-details', portalUserId],
    queryFn: async () => {
      if (!portalUserId) return null;
      
      console.log('🔥 Fetching portal user details for:', portalUserId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, is_active, created_at, last_login_at')
        .eq('id', portalUserId)
        .eq('role', 'client')
        .single();

      if (error) {
        console.error('🔥 Error fetching portal user details:', error);
        throw error;
      }

      console.log('🔥 Portal user details fetched:', data);
      return data;
    },
    enabled: !!portalUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
