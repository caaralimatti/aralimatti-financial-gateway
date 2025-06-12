
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { adminActivityService } from '@/services/adminActivityService';
import { UpdateUserMutationData } from '@/types/userManagementMutations';
import { UserProfile } from '@/types/userManagement';

export const useUpdateUser = (users: UserProfile[]) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: UpdateUserMutationData) => {
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
};
