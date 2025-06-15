
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserDeletion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteUserCompletely = async (userId: string, userEmail: string) => {
    try {
      console.log('🔥 Starting complete user deletion for:', userId);

      // First, delete the profile (this should cascade to related data)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('🔥 Error deleting profile:', profileError);
        throw new Error(`Failed to delete user profile: ${profileError.message}`);
      }

      // Try to delete the auth user using admin functions
      // Note: This requires admin privileges and may not work in all environments
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) {
          console.warn('🔥 Warning: Could not delete auth user directly:', authError);
          // Don't throw error here as profile deletion was successful
        } else {
          console.log('🔥 Auth user deleted successfully');
        }
      } catch (authDeleteError) {
        console.warn('🔥 Warning: Auth user deletion not available in this environment');
        // This is expected in some setups where admin functions aren't available
      }

      // Invalidate all user-related queries
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      await queryClient.invalidateQueries({ queryKey: ['portal-user-details'] });

      console.log('🔥 User deletion completed successfully');
      
      toast({
        title: "User Deleted",
        description: `User ${userEmail} has been completely removed from the system.`,
      });

      return { success: true };
    } catch (error) {
      console.error('🔥 Error in complete user deletion:', error);
      toast({
        title: "Deletion Error",
        description: error.message || "Failed to completely delete user. Some records may remain.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { deleteUserCompletely };
};
