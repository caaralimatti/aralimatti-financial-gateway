
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminActivityService } from '@/services/adminActivityService';

export const useAdminActivity = () => {
  const queryClient = useQueryClient();

  const {
    data: activities = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: () => adminActivityService.fetchRecentActivities(10),
    refetchInterval: 30000 // Refetch every 30 seconds for real-time updates
  });

  const logActivityMutation = useMutation({
    mutationFn: ({ 
      activity_type, 
      description, 
      metadata 
    }: { 
      activity_type: string; 
      description: string; 
      metadata?: any; 
    }) => adminActivityService.logActivity(activity_type, description, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
    }
  });

  return {
    activities,
    isLoading,
    error,
    logActivity: logActivityMutation.mutate,
    isLogging: logActivityMutation.isPending
  };
};
