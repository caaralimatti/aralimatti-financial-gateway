
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StaffClientAssignment {
  id: string;
  staff_profile_id: string;
  client_id: string;
  assigned_by: string;
  assigned_at: string;
}

export const useStaffClientAssignments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all assignments
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['staff-client-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff_client_assignments')
        .select('*');
      if (error) throw error;
      return data as StaffClientAssignment[];
    }
  });

  // Get assignments for a specific staff member
  const getStaffAssignments = (staffProfileId: string) => {
    return useQuery({
      queryKey: ['staff-assignments', staffProfileId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('staff_client_assignments')
          .select('client_id')
          .eq('staff_profile_id', staffProfileId);
        if (error) throw error;
        return data.map(a => a.client_id);
      },
      enabled: !!staffProfileId
    });
  };

  // Update assignments for a staff member
  const updateStaffAssignments = useMutation({
    mutationFn: async ({ staffProfileId, clientIds }: { staffProfileId: string; clientIds: string[] }) => {
      // First, delete existing assignments
      const { error: deleteError } = await supabase
        .from('staff_client_assignments')
        .delete()
        .eq('staff_profile_id', staffProfileId);
      
      if (deleteError) throw deleteError;

      // Then, insert new assignments
      if (clientIds.length > 0) {
        // Get current user ID first
        const { data: { user } } = await supabase.auth.getUser();
        
        const assignments = clientIds.map(clientId => ({
          staff_profile_id: staffProfileId,
          client_id: clientId,
          assigned_by: user?.id
        }));

        const { error: insertError } = await supabase
          .from('staff_client_assignments')
          .insert(assignments);
        
        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-client-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['staff-assignments'] });
      toast({
        title: "Success",
        description: "Staff client assignments updated successfully"
      });
    },
    onError: (error) => {
      console.error('Error updating staff assignments:', error);
      toast({
        title: "Error",
        description: "Failed to update staff client assignments",
        variant: "destructive"
      });
    }
  });

  return {
    assignments,
    isLoading,
    getStaffAssignments,
    updateStaffAssignments: updateStaffAssignments.mutate,
    isUpdating: updateStaffAssignments.isPending
  };
};

// Hook for staff to get their assigned clients
export const useStaffAssignedClients = () => {
  return useQuery({
    queryKey: ['staff-assigned-clients'],
    queryFn: async () => {
      // Get current user ID first
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('staff_client_assignments')
        .select(`
          client_id,
          clients (
            id,
            name,
            file_no
          )
        `)
        .eq('staff_profile_id', user?.id);
      
      if (error) throw error;
      return data.map(assignment => assignment.clients).filter(Boolean);
    }
  });
};
