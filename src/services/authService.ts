
import { supabase } from '@/integrations/supabase/client';
import { CreateUserData } from '@/types/userManagement';

export const authService = {
  async createAuthUser(userData: CreateUserData) {
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
        await this.disableUser(authData.user.id);
      }
    }

    return authData;
  },

  async toggleUserAuthStatus(userId: string, isActive: boolean) {
    console.log('Toggling user auth status:', { userId, isActive });
    
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
        } else {
          console.log('User enabled in auth successfully');
        }
      } else {
        await this.disableUser(userId);
      }
    } catch (authError) {
      console.error('Auth operation error:', authError);
      // Don't throw - profile update was successful
    }
  },

  async disableUser(userId: string) {
    console.log('Disabling user in auth since isActive is false');
    const { error: disableError } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        ban_duration: 'indefinite'
      }
    );

    if (disableError) {
      console.error('Error disabling user in auth:', disableError);
    } else {
      console.log('User disabled in auth successfully');
    }
  },

  async deleteAuthUser(userId: string) {
    console.log('Deleting auth user:', userId);
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.warn('Could not delete auth user:', authError);
      } else {
        console.log('Auth user deleted successfully');
      }
    } catch (error) {
      console.warn('Error deleting auth user:', error);
    }
  },

  async sendPasswordResetEmail(email: string) {
    console.log('Sending password reset email to:', email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Password reset error:', error);
      throw error;
    }
    console.log('Password reset email sent');
  }
};
