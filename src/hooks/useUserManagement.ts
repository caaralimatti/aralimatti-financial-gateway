import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { adminActivityService } from '@/services/adminActivityService';
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
      
      // Log the activity
      await adminActivityService.logActivity(
        'user_added',
        `Created new ${userData.role} user: ${userData.email}`,
        { email: userData.email, role: userData.role }
      );
      
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
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
    mutationFn: async (userData: UpdateUserData) => {
      // Get current user data for comparison
      const currentUser = users.find(u => u.id === userData.id);
      const changedFields: any = {};
      
      // Track changes for enhanced logging (only for supported fields)
      if (currentUser) {
        if (userData.fullName !== undefined && userData.fullName !== currentUser.full_name) {
          changedFields.full_name = { old: currentUser.full_name, new: userData.fullName };
        }
        if (userData.role !== undefined && userData.role !== currentUser.role) {
          changedFields.role = { old: currentUser.role, new: userData.role };
        }
        if (userData.isActive !== undefined && userData.isActive !== currentUser.is_active) {
          changedFields.is_active = { old: currentUser.is_active, new: userData.isActive };
        }
      }
      
      const result = await userService.updateUserProfile(userData);
      
      // Log the activity with enhanced metadata
      await adminActivityService.logActivity(
        'user_updated',
        `Updated user profile: ${userData.id}`,
        { 
          userId: userData.id,
          changedFields: Object.keys(changedFields).length > 0 ? changedFields : undefined
        }
      );
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
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
      
      // Get current user data for enhanced logging
      const currentUser = users.find(u => u.id === userId);
      const changedFields = {
        is_active: { old: currentUser?.is_active, new: isActive }
      };
      
      // Step 1: Update the profile table
      const data = await userService.updateUserProfile({ id: userId, isActive });

      // Step 2: Update auth.users to actually prevent/allow login
      await authService.toggleUserAuthStatus(userId, isActive);

      // Log the activity with enhanced metadata
      await adminActivityService.logActivity(
        'user_status_changed',
        `${isActive ? 'Activated' : 'Deactivated'} user: ${userId}`,
        { 
          userId, 
          isActive,
          changedFields
        }
      );

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
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
      
      // Log the activity
      await adminActivityService.logActivity(
        'user_deleted',
        `Deleted user: ${userId}`,
        { userId }
      );
      
      console.log('User deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
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
    mutationFn: async (email: string) => {
      await authService.sendPasswordResetEmail(email);
      
      // Log the activity
      await adminActivityService.logActivity(
        'password_reset_sent',
        `Sent password reset email to: ${email}`,
        { email }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-activities'] });
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
