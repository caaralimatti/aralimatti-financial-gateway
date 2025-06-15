
import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { getInitialFormData, transformFormDataToClientData, validateRequiredFields } from '@/utils/clientFormUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';
import type { ClientFormData } from '@/types/clientForm';

export const useClientForm = (editingClient?: Tables<'clients'> | null) => {
  const { createClient, updateClient, isCreating, isUpdating } = useClients();
  const { toast } = useToast();
  const [clientForm, setClientForm] = useState<ClientFormData>(getInitialFormData(editingClient));

  const resetForm = () => {
    setClientForm(getInitialFormData());
  };

  const createPortalUserViaEdgeFunction = async (email: string, password: string, fullName: string) => {
    try {
      // Use an edge function or API call that doesn't affect the current session
      // This prevents the admin session from being overridden
      const { data, error } = await supabase.functions.invoke('create-client-user', {
        body: {
          email,
          password,
          fullName,
          role: 'client'
        }
      });

      if (error) throw error;
      return data?.user;
    } catch (error) {
      console.error('Error creating portal user via edge function:', error);
      
      // Fallback: Create user with admin privileges (requires service role key)
      // This is a temporary workaround - in production, use edge functions
      try {
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
            role: 'client'
          }
        });

        if (userError) throw userError;
        return userData.user;
      } catch (adminError) {
        console.error('Admin user creation also failed:', adminError);
        throw adminError;
      }
    }
  };

  const saveClient = async (onSuccess: () => void) => {
    try {
      // Validate required fields
      if (!validateRequiredFields(clientForm)) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      let portalUserId = null;

      // Create portal user if requested - using method that preserves admin session
      if (clientForm.portalUser.createPortalUser) {
        try {
          const portalUser = await createPortalUserViaEdgeFunction(
            clientForm.portalUser.email,
            clientForm.portalUser.generatedPassword!,
            clientForm.portalUser.fullName
          );
          portalUserId = portalUser?.id;

          toast({
            title: "Portal User Created",
            description: `Portal user account created for ${clientForm.portalUser.email}`,
          });
        } catch (error: any) {
          console.error('Error creating portal user:', error);
          toast({
            title: "Error Creating Portal User",
            description: error.message || "Failed to create portal user account",
            variant: "destructive",
          });
          return;
        }
      }

      const clientData = transformFormDataToClientData(clientForm);

      // Add portal user link if created
      if (portalUserId) {
        clientData.primary_portal_user_profile_id = portalUserId;
      }

      if (editingClient) {
        await updateClient({ id: editingClient.id, ...clientData });
      } else {
        await createClient(clientData);
      }

      // Show password info if portal user was created
      if (clientForm.portalUser.createPortalUser) {
        toast({
          title: "Client Created Successfully",
          description: `Client saved. Portal user login: ${clientForm.portalUser.email}`,
        });
      }

      onSuccess();
      resetForm();
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Error",
        description: "Failed to save client. Please try again.",
        variant: "destructive",
      });
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
