
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { adminActivityService } from '@/services/adminActivityService';
import { ToggleUserStatusData } from '@/types/userManagementMutations';
import { UserProfile } from '@/types/userManagement';

export const useToggleUserStatus = (users: UserProfile[]) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isActive }: ToggleUserStatusData) => {
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
};
