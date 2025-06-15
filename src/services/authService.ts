
import { supabase } from '@/integrations/supabase/client';
import { CreateUserData } from '@/types/userManagement';

export const authService = {
  async validateUserAccess(userId: string) {
    console.log('🔥 Validating user access for:', userId);
    
    try {
      // Use select without .maybeSingle() to avoid problematic Accept header
      const { data, error } = await supabase
        .from('profiles')
        .select('is_active, role, full_name, email')
        .eq('id', userId)
        .limit(1);

      if (error) {
        console.error('🔥 Error validating user access:', error);
        return { isValid: false, reason: 'Database error' };
      }

      // Handle array response
      const profile = data && data.length > 0 ? data[0] : null;
      
      if (!profile) {
        console.log('🔥 No profile found for user');
        return { isValid: false, reason: 'Profile not found - Please contact your administrator' };
      }

      if (!profile.is_active) {
        console.log('🔥 User account is inactive');
        return { isValid: false, reason: 'Your account is currently inactive. Please contact your administrator.' };
      }

      console.log('🔥 User access validated successfully for:', profile.full_name);
      return { isValid: true, profile };
    } catch (error) {
      console.error('🔥 Error in validateUserAccess:', error);
      return { isValid: false, reason: 'Validation failed' };
    }
  },

  async updateLastLoginTimestamp(userId: string) {
    console.log('🔥 Updating last login timestamp for user:', userId);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) {
        console.error('🔥 Error updating last login timestamp:', error);
        throw error;
      }

      console.log('🔥 Last login timestamp updated successfully');
    } catch (error) {
      console.error('🔥 Error in updateLastLoginTimestamp:', error);
      throw error;
    }
  },

  async createAuthUser(userData: CreateUserData) {
    console.log('🔥 Creating auth user:', userData.email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role,
          },
          emailRedirectTo: `${window.location.origin}/auth`
        },
      });

      if (error) {
        console.error('🔥 Error creating auth user:', error);
        throw error;
      }

      console.log('🔥 Auth user created successfully:', data.user?.id);
      return data;
    } catch (error) {
      console.error('🔥 Error in createAuthUser:', error);
      throw error;
    }
  },

  async toggleUserAuthStatus(userId: string, isActive: boolean) {
    console.log('🔥 Toggling user auth status:', { userId, isActive });
    
    try {
      // Note: In production, this would require admin privileges
      // For now, we'll just log the action as the actual auth user status
      // is controlled by the is_active field in the profiles table
      console.log('🔥 Auth status toggle logged for user:', userId);
    } catch (error) {
      console.error('🔥 Error toggling auth status:', error);
      throw error;
    }
  },

  async deleteAuthUser(userId: string) {
    console.log('🔥 Deleting auth user:', userId);
    
    try {
      // Note: In production, this would require admin privileges
      // For now, we'll just log the action as the actual user deletion
      // is handled by the profile deletion with cascade
      console.log('🔥 Auth user deletion logged for:', userId);
    } catch (error) {
      console.error('🔥 Error deleting auth user:', error);
      throw error;
    }
  },

  async sendPasswordResetEmail(email: string) {
    console.log('🔥 Sending password reset email to:', email);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('🔥 Error sending password reset email:', error);
        throw error;
      }

      console.log('🔥 Password reset email sent successfully');
    } catch (error) {
      console.error('🔥 Error in sendPasswordResetEmail:', error);
      throw error;
    }
  }
};
