
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
        // Enable the user - use ban_duration: 'none'
        console.log('Enabling user in auth');
        
        const { error: enableError } = await supabase.auth.admin.updateUserById(
          userId,
          { 
            ban_duration: 'none'
          }
        );

        if (enableError) {
          console.error('Error enabling user:', enableError);
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
    console.log('Disabling user in auth');
    
    try {
      // Disable the user using ban_duration
      const { error: disableError } = await supabase.auth.admin.updateUserById(
        userId,
        { 
          ban_duration: 'indefinite'
        }
      );

      if (disableError) {
        console.error('Error disabling user:', disableError);
      } else {
        console.log('User disabled in auth successfully');
      }
    } catch (error) {
      console.error('Error disabling user:', error);
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
  },

  async validateUserAccess(userId: string): Promise<{ isValid: boolean; reason?: string }> {
    console.log('Validating user access for:', userId);
    
    try {
      // Check profile is_active status first (most reliable check)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_active')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return { isValid: false, reason: 'Profile not found' };
      }

      if (!profile.is_active) {
        console.log('User is marked as inactive in profile');
        return { isValid: false, reason: 'Account is inactive' };
      }

      // Additional check: Try to fetch auth user to verify account exists and is accessible
      const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
      
      if (userError || !user) {
        console.error('Error fetching auth user:', userError);
        return { isValid: false, reason: 'User not found in auth system' };
      }

      // If we get here, the user is active and accessible
      return { isValid: true };
    } catch (error) {
      console.error('Error validating user access:', error);
      return { isValid: false, reason: 'Validation error' };
    }
  }
};
