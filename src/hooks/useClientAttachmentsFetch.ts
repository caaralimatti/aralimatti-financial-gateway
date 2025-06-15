
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClientAttachmentsFetch = (clientId?: string) => {
  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['client-attachments', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from('client_attachments')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!clientId
  });

  return { attachments, isLoading };
};
