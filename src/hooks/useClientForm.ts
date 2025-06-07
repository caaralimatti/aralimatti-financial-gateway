
import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { getInitialFormData, transformFormDataToClientData, validateRequiredFields } from '@/utils/clientFormUtils';
import type { Tables } from '@/integrations/supabase/types';
import type { ClientFormData } from '@/types/clientForm';

export const useClientForm = (editingClient?: Tables<'clients'> | null) => {
  const { createClient, updateClient, isCreating, isUpdating } = useClients();
  const [clientForm, setClientForm] = useState<ClientFormData>(getInitialFormData(editingClient));

  const resetForm = () => {
    setClientForm(getInitialFormData());
  };

  const saveClient = async (onSuccess: () => void) => {
    try {
      // Validate required fields
      if (!validateRequiredFields(clientForm)) {
        console.error('Missing required fields');
        return;
      }

      const clientData = transformFormDataToClientData(clientForm);

      if (editingClient) {
        await updateClient({ id: editingClient.id, ...clientData });
      } else {
        await createClient(clientData);
      }

      onSuccess();
      resetForm();
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return {
    clientForm,
    setClientForm,
    saveClient,
    isLoading,
    resetForm
  };
};
