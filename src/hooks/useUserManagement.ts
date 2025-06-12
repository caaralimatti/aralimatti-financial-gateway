
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { useCreateUser } from '@/hooks/mutations/useCreateUser';
import { useUpdateUser } from '@/hooks/mutations/useUpdateUser';
import { useToggleUserStatus } from '@/hooks/mutations/useToggleUserStatus';
import { useDeleteUser } from '@/hooks/mutations/useDeleteUser';
import { useSendPasswordReset } from '@/hooks/mutations/useSendPasswordReset';

export const useUserManagement = () => {
  const { profile } = useAuth();

  // Fetch all users (admin only)
  const {
    data: users = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.fetchUsers,
    enabled: profile?.role === 'admin'
  });

  // Initialize mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser(users);
  const toggleUserStatusMutation = useToggleUserStatus(users);
  const deleteUserMutation = useDeleteUser();
  const sendPasswordResetMutation = useSendPasswordReset();

  return {
    users,
    isLoading,
    error,
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    toggleUserStatus: toggleUserStatusMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    sendPasswordReset: sendPasswordResetMutation.mutate,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isToggling: toggleUserStatusMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isSendingReset: sendPasswordResetMutation.isPending
  };
};
