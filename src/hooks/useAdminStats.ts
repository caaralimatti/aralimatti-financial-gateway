
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  const {
    data: stats,
    isLoading,
    error
  } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('🔥 Fetching admin dashboard stats');

      // Fetch total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('🔥 Error fetching total users:', usersError);
        throw usersError;
      }

      // Fetch active clients count
      const { count: activeClients, error: clientsError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client')
        .eq('is_active', true);

      if (clientsError) {
        console.error('🔥 Error fetching active clients:', clientsError);
        throw clientsError;
      }

      // Fetch staff members count
      const { count: staffMembers, error: staffError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'staff')
        .eq('is_active', true);

      if (staffError) {
        console.error('🔥 Error fetching staff members:', staffError);
        throw staffError;
      }

      console.log('🔥 Admin stats fetched successfully:', {
        totalUsers,
        activeClients,
        staffMembers
      });

      return {
        totalUsers: totalUsers || 0,
        activeClients: activeClients || 0,
        staffMembers: staffMembers || 0
      };
    },
    refetchInterval: 60000 // Refetch every minute for real-time updates
  });

  return {
    stats,
    isLoading,
    error
  };
};
