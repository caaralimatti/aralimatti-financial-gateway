import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo } from 'react';

interface ClientFilters {
  search?: string;
  status?: string;
  type?: string;
}

export const useOptimizedClients = (filters: ClientFilters = {}) => {
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients', filters],
    queryFn: async () => {
      let query = supabase
        .from('clients')
        .select(`
          id,
          name,
          file_no,
          primary_email,
          primary_mobile,
          status,
          client_type,
          created_at,
          working_user_id,
          primary_portal_user_profile_id
        `)
        .order('created_at', { ascending: false });

      // Apply filters at database level for better performance
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status as any);
      }

      if (filters.type && filters.type !== 'all') {
        query = query.eq('client_type', filters.type as any);
      }

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,file_no.ilike.%${filters.search}%,primary_email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const memoizedClients = useMemo(() => clients || [], [clients]);

  return {
    clients: memoizedClients,
    isLoading,
    error,
  };
};