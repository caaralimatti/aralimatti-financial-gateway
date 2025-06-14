
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { ContactPerson } from '@/types/clientForm';

export const useClientContactPersons = (clientId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contactPersons = [], isLoading } = useQuery({
    queryKey: ['client-contact-persons', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      
      const { data, error } = await supabase
        .from('client_contact_persons')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId
  });

  const createContactPersonMutation = useMutation({
    mutationFn: async ({ clientId, contactPerson }: { clientId: string; contactPerson: ContactPerson }) => {
      const { data, error } = await supabase
        .from('client_contact_persons')
        .insert({
          client_id: clientId,
          name: contactPerson.name,
          email: contactPerson.email,
          mobile: contactPerson.mobile,
          designation: contactPerson.designation,
          is_primary: contactPerson.is_primary
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contact-persons', clientId] });
      toast({
        title: "Success",
        description: "Contact person added successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating contact person:', error);
      toast({
        title: "Error",
        description: "Failed to add contact person",
        variant: "destructive",
      });
    }
  });

  const updateContactPersonMutation = useMutation({
    mutationFn: async ({ id, contactPerson }: { id: string; contactPerson: Partial<ContactPerson> }) => {
      const { data, error } = await supabase
        .from('client_contact_persons')
        .update({
          name: contactPerson.name,
          email: contactPerson.email,
          mobile: contactPerson.mobile,
          designation: contactPerson.designation,
          is_primary: contactPerson.is_primary
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contact-persons', clientId] });
      toast({
        title: "Success",
        description: "Contact person updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating contact person:', error);
      toast({
        title: "Error",
        description: "Failed to update contact person",
        variant: "destructive",
      });
    }
  });

  const deleteContactPersonMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_contact_persons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-contact-persons', clientId] });
      toast({
        title: "Success",
        description: "Contact person deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting contact person:', error);
      toast({
        title: "Error",
        description: "Failed to delete contact person",
        variant: "destructive",
      });
    }
  });

  return {
    contactPersons,
    isLoading,
    createContactPerson: createContactPersonMutation.mutateAsync,
    updateContactPerson: updateContactPersonMutation.mutateAsync,
    deleteContactPerson: deleteContactPersonMutation.mutateAsync,
    isCreating: createContactPersonMutation.isPending,
    isUpdating: updateContactPersonMutation.isPending,
    isDeleting: deleteContactPersonMutation.isPending
  };
};
