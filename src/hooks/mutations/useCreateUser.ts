
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import { adminActivityService } from '@/services/adminActivityService';
import { CreateUserMutationData } from '@/types/userManagementMutations';

export const useCreateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserMutationData) => {
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
    onSuccess: () => {
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
};
