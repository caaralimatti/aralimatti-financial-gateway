
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { adminActivityService } from '@/services/adminActivityService';

export const useDeleteUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
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
};
