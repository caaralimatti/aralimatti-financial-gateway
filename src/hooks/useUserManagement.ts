
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { CreateUserData, UpdateUserData } from '@/types/userManagement';

export const useUserManagement = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      const result = await authService.createAuthUser(userData);
      console.log('User creation successful:', result.user?.id);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error in user creation mutation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: userService.updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Toggle user status mutation
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      console.log('Toggling user status:', { userId, isActive });
      
      // Step 1: Update the profile table
      const data = await userService.updateUserProfile({ id: userId, isActive });

      // Step 2: Update auth.users to actually prevent/allow login
      await authService.toggleUserAuthStatus(userId, isActive);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      const statusText = data.is_active ? 'activated' : 'deactivated';
      toast({
        title: "Success",
        description: `User ${statusText} successfully`,
      });
    },
    onError: (error: any) => {
      console.error('Error toggling user status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // First delete from profiles
      await userService.deleteUserProfile(userId);
      
      // Then delete from auth (this requires admin privileges)
      await authService.deleteAuthUser(userId);
      
      console.log('User deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Send password reset email
  const sendPasswordResetMutation = useMutation({
    mutationFn: authService.sendPasswordResetEmail,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset email sent successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error sending reset email:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email.",
        variant: "destructive",
      });
    }
  });

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
