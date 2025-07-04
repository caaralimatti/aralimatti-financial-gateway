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

      // Check if the response indicates an error even if no error was thrown
      if (data?.error) {
        console.error('🔥 Edge function returned error:', data);
        
        // Handle specific error codes with better messaging
        let userFriendlyMessage = data.details || data.error;
        
        if (data.errorCode === 'EMAIL_ALREADY_REGISTERED' || data.errorCode === 'ORPHANED_AUTH_RECORD') {
          userFriendlyMessage = `The email ${email} appears to be from a recently deleted account. ${data.suggestion || 'Please wait 5-10 minutes and try again, or use a different email address.'}`;
        } else if (data.errorCode === 'EMAIL_EXISTS_IN_PROFILES') {
          userFriendlyMessage = `The email ${email} is already registered in the system. Please use a different email address.`;
        }
        
        throw new Error(userFriendlyMessage);
      }
      
      console.log('🔥 Portal user created successfully via edge function:', data?.user?.id);
      return data?.user;
    } catch (error) {
      console.error('🔥 Error creating portal user via edge function:', error);
      
      // Provide more specific error messages based on error details
      let errorMessage = `Failed to create portal user account for ${email}.`;
      
      if (error.message?.includes('recently deleted account') || error.message?.includes('wait 5-10 minutes')) {
        errorMessage = error.message; // Use the enhanced message from above
      } else if (error.message?.includes('EMAIL_EXISTS') || error.message?.includes('already registered') || error.message?.includes('already exists')) {
        errorMessage = `The email ${email} is already registered in the system. Please use a different email address.`;
      } else if (error.message?.includes('EMAIL_ALREADY_REGISTERED')) {
        errorMessage = `The email ${email} is already registered. Please use a different email address for the portal user.`;
      } else if (error.message?.includes('password')) {
        errorMessage = `Password does not meet security requirements. Please regenerate the password and try again.`;
      } else if (error.message?.includes('Internal server error')) {
        errorMessage = `An internal error occurred while creating the portal user. Please try again or contact support if the issue persists.`;
      } else if (error.message?.includes('cleanup')) {
        errorMessage = error.message; // Use the specific cleanup message
      }
      
      throw new Error(errorMessage);
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
            description: error.message || "Failed to create portal user account. Please try again.",
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
