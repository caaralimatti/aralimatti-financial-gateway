
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dscService } from '@/services/dscService';
import { CreateDSCData, UpdateDSCData } from '@/types/dsc';
import { toast } from 'sonner';

export const useDSCManagement = () => {
  const queryClient = useQueryClient();

  const {
    data: dscCertificates = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['dsc-certificates'],
    queryFn: dscService.fetchDSCCertificates,
  });

  const createMutation = useMutation({
    mutationFn: dscService.createDSCCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsc-certificates'] });
      toast.success('DSC certificate created successfully');
    },
    onError: (error) => {
      console.error('Error creating DSC certificate:', error);
      toast.error('Failed to create DSC certificate');
    },
  });

  const updateMutation = useMutation({
    mutationFn: dscService.updateDSCCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsc-certificates'] });
      toast.success('DSC certificate updated successfully');
    },
    onError: (error) => {
      console.error('Error updating DSC certificate:', error);
      toast.error('Failed to update DSC certificate');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: dscService.deleteDSCCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsc-certificates'] });
      toast.success('DSC certificate deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting DSC certificate:', error);
      toast.error('Failed to delete DSC certificate');
    },
  });

  return {
    dscCertificates,
    isLoading,
    error,
    createDSC: createMutation.mutate,
    updateDSC: updateMutation.mutate,
    deleteDSC: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useClientDSCCertificates = (clientId: string) => {
  return useQuery({
    queryKey: ['client-dsc-certificates', clientId],
    queryFn: () => dscService.fetchClientDSCCertificates(clientId),
    enabled: !!clientId,
  });
};
