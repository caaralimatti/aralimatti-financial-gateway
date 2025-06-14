
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminPermissionsService } from '@/services/adminPermissionsService';
import { AdminPermissionUpdate } from '@/types/adminPermissions';
import { toast } from 'sonner';

export const useAdminPermissions = () => {
  const queryClient = useQueryClient();

  const {
    data: adminUsers = [],
    isLoading: isLoadingUsers,
    error: usersError
  } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminPermissionsService.fetchAdminUsers
  });

  const fetchAdminPermissions = (adminProfileId: string) => {
    return useQuery({
      queryKey: ['admin-permissions', adminProfileId],
      queryFn: () => adminPermissionsService.fetchAdminPermissions(adminProfileId),
      enabled: !!adminProfileId
    });
  };

  const updatePermissionMutation = useMutation({
    mutationFn: (update: AdminPermissionUpdate) => 
      adminPermissionsService.updateAdminPermission(update),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['admin-permissions', variables.admin_profile_id] 
      });
      toast.success('Permission updated successfully');
    },
    onError: (error) => {
      console.error('Error updating permission:', error);
      toast.error('Failed to update permission');
    }
  });

  return {
    adminUsers,
    isLoadingUsers,
    usersError,
    fetchAdminPermissions,
    updatePermission: updatePermissionMutation.mutate,
    isUpdatingPermission: updatePermissionMutation.isPending
  };
};

export const useCurrentUserPermissions = () => {
  return useQuery({
    queryKey: ['current-user-permissions'],
    queryFn: adminPermissionsService.fetchCurrentUserPermissions
  });
};
