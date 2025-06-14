
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

export type Client = Tables<'clients'>;

export const useClientQueries = () => {
  const { profile } = useAuth();

  // Fetch all clients
  const {
    data: clients = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          working_user:profiles!working_user_id(full_name),
          created_by_profile:profiles!created_by(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id
  });

  return {
    clients,
    isLoading,
    error
  };
};
