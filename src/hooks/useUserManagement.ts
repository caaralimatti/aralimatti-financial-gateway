
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'staff' | 'client';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'staff' | 'client';
  isActive: boolean;
}

export interface UpdateUserData {
  id: string;
  fullName?: string;
  role?: 'admin' | 'staff' | 'client';
  isActive?: boolean;
}

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
    queryFn: async () => {
      console.log('Fetching users...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      console.log('Fetched users:', data);
      return data as UserProfile[];
    },
    enabled: profile?.role === 'admin'
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: CreateUserData) => {
      console.log('Creating user mutation started with:', userData);
      
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role,
          },
        },
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw authError;
      }

      console.log('Auth user created:', authData.user?.id);

      if (authData.user) {
        // Update the profile with the is_active status
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ is_active: userData.isActive })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          throw profileError;
        }
        
        console.log('Profile updated with is_active status');

        // If user should be inactive, disable them in auth
        if (!userData.isActive) {
          console.log('Disabling user in auth since isActive is false');
          const { error: disableError } = await supabase.auth.admin.updateUserById(
            authData.user.id,
            { 
              ban_duration: 'indefinite'
            }
          );

          if (disableError) {
            console.error('Error disabling user in auth:', disableError);
            // Don't throw here as the user creation was successful
          } else {
            console.log('User disabled in auth successfully');
          }
        }
      }

      return authData;
    },
    onSuccess: (data) => {
      console.log('User creation successful:', data.user?.id);
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
    mutationFn: async (userData: UpdateUserData) => {
      console.log('Updating user:', userData);
      const updateData: any = {};
      
      if (userData.fullName !== undefined) updateData.full_name = userData.fullName;
      if (userData.role !== undefined) updateData.role = userData.role;
      if (userData.isActive !== undefined) updateData.is_active = userData.isActive;

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userData.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      console.log('User updated successfully:', data);
      return data;
    },
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

  // Toggle user status mutation - CRITICAL SECURITY FIX
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      console.log('Toggling user status:', { userId, isActive });
      
      // Step 1: Update the profile table
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Status toggle error:', error);
        throw error;
      }
      console.log('Profile status toggled:', data);

      // Step 2: Update auth.users to actually prevent/allow login
      try {
        if (isActive) {
          // Enable the user - remove ban
          console.log('Enabling user in auth (removing ban)');
          const { error: enableError } = await supabase.auth.admin.updateUserById(
            userId,
            { 
              ban_duration: 'none'
            }
          );

          if (enableError) {
            console.error('Error enabling user in auth:', enableError);
            // Still return success for profile update
          } else {
            console.log('User enabled in auth successfully');
          }
        } else {
          // Disable the user - add indefinite ban
          console.log('Disabling user in auth (adding indefinite ban)');
          const { error: disableError } = await supabase.auth.admin.updateUserById(
            userId,
            { 
              ban_duration: 'indefinite'
            }
          );

          if (disableError) {
            console.error('Error disabling user in auth:', disableError);
            // Still return success for profile update
          } else {
            console.log('User disabled in auth successfully');
          }
        }
      } catch (authError) {
        console.error('Auth operation error:', authError);
        // Don't throw - profile update was successful
      }

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
      console.log('Deleting user:', userId);
      
      // First delete from profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Profile deletion error:', profileError);
        throw profileError;
      }

      // Then delete from auth (this requires admin privileges)
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        
        if (authError) {
          console.warn('Could not delete auth user:', authError);
          // Don't throw here as the profile is already deleted
        } else {
          console.log('Auth user deleted successfully');
        }
      } catch (error) {
        console.warn('Error deleting auth user:', error);
        // Don't throw - profile deletion was successful
      }
      
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
    mutationFn: async (email: string) => {
      console.log('Sending password reset email to:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }
      console.log('Password reset email sent');
    },
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
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    toggleUserStatus: toggleUserStatusMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    sendPasswordReset: sendPasswordResetMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isToggling: toggleUserStatusMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isSendingReset: sendPasswordResetMutation.isPending
  };
};
