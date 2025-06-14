
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ClientFormData, CustomField } from '@/types/clientForm';

interface ImportData {
  name: string;
  email?: string;
  mobile?: string;
  file_no: string;
  client_type: string;
  working_user?: string;
  status?: string;
  customFields?: CustomField[];
}

export const useClientImport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const importClientsMutation = useMutation({
    mutationFn: async (importData: ImportData[]) => {
      const results = [];
      
      for (const clientData of importData) {
        // Create the client first
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .insert({
            name: clientData.name,
            primary_email: clientData.email,
            primary_mobile: clientData.mobile,
            file_no: clientData.file_no,
            client_type: clientData.client_type as any,
            status: (clientData.status || 'Active') as any
          })
          .select()
          .single();

        if (clientError) throw clientError;

        // Add custom fields if any
        if (clientData.customFields && clientData.customFields.length > 0) {
          for (const customField of clientData.customFields) {
            const { error: customFieldError } = await supabase
              .from('client_custom_fields')
              .insert({
                client_id: client.id,
                field_name: customField.field_name,
                field_value: customField.field_value,
                field_type: customField.field_type
              });

            if (customFieldError) {
              console.error('Error adding custom field:', customFieldError);
            }
          }
        }

        results.push(client);
      }

      return results;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Success",
        description: `Successfully imported ${data.length} clients`,
      });
    },
    onError: (error) => {
      console.error('Error importing clients:', error);
      toast({
        title: "Error",
        description: "Failed to import clients. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    importClients: importClientsMutation.mutateAsync,
    isImporting: importClientsMutation.isPending
  };
};
