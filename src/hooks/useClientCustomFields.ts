
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { CustomField } from '@/types/clientForm';

export const useClientCustomFields = (clientId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: customFields = [], isLoading } = useQuery({
    queryKey: ['client-custom-fields', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from('client_custom_fields')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId
  });

  const createCustomFieldMutation = useMutation({
    mutationFn: async ({ clientId, customField }: { clientId: string; customField: CustomField }) => {
      const { data, error } = await supabase
        .from('client_custom_fields')
        .insert({
          client_id: clientId,
          field_name: customField.field_name,
          field_value: customField.field_value,
          field_type: customField.field_type
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-custom-fields', clientId] });
      toast({
        title: "Success",
        description: "Custom field added successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating custom field:', error);
      toast({
        title: "Error",
        description: "Failed to add custom field",
        variant: "destructive",
      });
    }
  });

  const updateCustomFieldMutation = useMutation({
    mutationFn: async ({ id, customField }: { id: string; customField: Partial<CustomField> }) => {
      const { data, error } = await supabase
        .from('client_custom_fields')
        .update({
          field_name: customField.field_name,
          field_value: customField.field_value,
          field_type: customField.field_type
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-custom-fields', clientId] });
      toast({
        title: "Success",
        description: "Custom field updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating custom field:', error);
      toast({
        title: "Error",
        description: "Failed to update custom field",
        variant: "destructive",
      });
    }
  });

  const deleteCustomFieldMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_custom_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-custom-fields', clientId] });
      toast({
        title: "Success",
        description: "Custom field deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting custom field:', error);
      toast({
        title: "Error",
        description: "Failed to delete custom field",
        variant: "destructive",
      });
    }
  });

  return {
    customFields,
    isLoading,
    createCustomField: createCustomFieldMutation.mutateAsync,
    updateCustomField: updateCustomFieldMutation.mutateAsync,
    deleteCustomField: deleteCustomFieldMutation.mutateAsync,
    isCreating: createCustomFieldMutation.isPending,
    isUpdating: updateCustomFieldMutation.isPending,
    isDeleting: deleteCustomFieldMutation.isPending
  };
};
