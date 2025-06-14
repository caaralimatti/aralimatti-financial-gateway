
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

interface BulkEditData {
  client_type?: string;
  working_user_id?: string;
  status?: string;
  tags?: string[];
  notes?: string;
}

export const useClientBulkEdit = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ clientIds, updates }: { clientIds: string[]; updates: BulkEditData }) => {
      const results = [];
      
      for (const clientId of clientIds) {
        const { data, error } = await supabase
          .from('clients')
          .update(updates)
          .eq('id', clientId)
          .select()
          .single();

        if (error) throw error;
        results.push(data);
      }

      return results;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Success",
        description: `Successfully updated ${data.length} clients`,
      });
    },
    onError: (error) => {
      console.error('Error updating clients:', error);
      toast({
        title: "Error",
        description: "Failed to update clients. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    bulkUpdate: bulkUpdateMutation.mutateAsync,
    isUpdating: bulkUpdateMutation.isPending
  };
};
