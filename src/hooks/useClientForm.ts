
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

  const checkIfEmailExists = async (email: string): Promise<boolean> => {
    try {
      console.log('🔥 Checking if email exists in profiles:', email);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', email)
        .limit(1);

      if (error) {
        console.error('🔥 Error checking email existence:', error);
        throw error;
      }

      const exists = data && data.length > 0;
      console.log('🔥 Email existence check result:', { email, exists, existingUser: data?.[0] });
      
      return exists;
    } catch (error) {
      console.error('🔥 Error in checkIfEmailExists:', error);
      throw error;
    }
  };

  const createPortalUserViaEdgeFunction = async (email: string, password: string, fullName: string) => {
    try {
      console.log('🔥 Creating portal user via edge function:', { email, fullName });
      
      // First check if email already exists
      const emailExists = await checkIfEmailExists(email);
      if (emailExists) {
        throw new Error(`A user with email ${email} already exists. Please use a different email address for the portal user.`);
      }

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

      if (error) {
        console.error('🔥 Edge function error:', error);
        throw error;
      }
      
      console.log('🔥 Portal user created successfully via edge function:', data?.user?.id);
      return data?.user;
    } catch (error) {
      console.error('🔥 Error creating portal user via edge function:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('already been registered') || error.message?.includes('email')) {
        throw new Error(`The email ${email} is already registered. Please use a different email address for the portal user.`);
      }
      
      throw error;
    }
  };

  const saveClient = async (onSuccess: () => void) => {
    try {
      console.log('🔥 Starting client save process');
      
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
        console.log('🔥 Portal user creation requested');
        
        if (!clientForm.portalUser.email) {
          toast({
            title: "Validation Error",
            description: "Please provide an email address for the portal user",
            variant: "destructive",
          });
          return;
        }

        if (!clientForm.portalUser.fullName) {
          toast({
            title: "Validation Error", 
            description: "Please provide a full name for the portal user",
            variant: "destructive",
          });
          return;
        }

        try {
          const portalUser = await createPortalUserViaEdgeFunction(
            clientForm.portalUser.email,
            clientForm.portalUser.generatedPassword!,
            clientForm.portalUser.fullName
          );
          portalUserId = portalUser?.id;

          console.log('🔥 Portal user created successfully:', portalUserId);
          toast({
            title: "Portal User Created",
            description: `Portal user account created for ${clientForm.portalUser.email}`,
          });
        } catch (error: any) {
          console.error('🔥 Error creating portal user:', error);
          toast({
            title: "Error Creating Portal User",
            description: error.message || "Failed to create portal user account. Please check if the email is already in use.",
            variant: "destructive",
          });
          return;
        }
      }

      const clientData = transformFormDataToClientData(clientForm);

      // Add portal user link if created
      if (portalUserId) {
        clientData.primary_portal_user_profile_id = portalUserId;
        console.log('🔥 Linking portal user to client:', portalUserId);
      }

      console.log('🔥 Saving client data:', { editing: !!editingClient, hasPortalUser: !!portalUserId });

      if (editingClient) {
        await updateClient({ id: editingClient.id, ...clientData });
      } else {
        await createClient(clientData);
      }

      // Show success message with portal user info if created
      if (clientForm.portalUser.createPortalUser && portalUserId) {
        toast({
          title: "Client Created Successfully",
          description: `Client saved with portal user login: ${clientForm.portalUser.email}`,
        });
      } else {
        toast({
          title: editingClient ? "Client Updated" : "Client Created",
          description: editingClient ? "Client updated successfully" : "Client created successfully",
        });
      }

      onSuccess();
      resetForm();
    } catch (error) {
      console.error('🔥 Error saving client:', error);
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
