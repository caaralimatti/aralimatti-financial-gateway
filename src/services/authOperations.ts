
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/authService';
import { UserRole } from '@/types/auth';

export const authOperations = {
  async signIn(email: string, password: string) {
    console.log('🔥 Attempting to sign in with:', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔥 Sign in error:', error);
        throw error;
      }

      // Simplified validation after successful sign in
      if (data.user) {
        console.log('🔥 Sign in successful, validating user access...');
        const validation = await authService.validateUserAccess(data.user.id);
        
        if (!validation.isValid) {
          console.log('🔥 User access denied after sign in:', validation.reason);
          await supabase.auth.signOut();
          throw new Error(validation.reason || 'Account is inactive');
        }

        // Update last login timestamp
        console.log('🔥 Updating last login timestamp for user:', data.user.id);
        await authService.updateLastLoginTimestamp(data.user.id);
      }

      console.log('🔥 Sign in completed successfully');
    } catch (error) {
      console.error('🔥 Sign in process failed:', error);
      throw error;
    }
  },

  async signUp(email: string, password: string, fullName: string, role: UserRole = 'client') {
    console.log('🔥 Attempting to sign up with:', { email, fullName, role });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        console.error('🔥 Sign up error:', error);
        throw error;
      }

      console.log('🔥 Sign up successful:', data);
    } catch (error) {
      console.error('🔥 Sign up process failed:', error);
      throw error;
    }
  },

  async signOut() {
    console.log('🔥 Signing out...');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('🔥 Sign out error:', error);
        throw error;
      }
      console.log('🔥 Sign out successful');
    } catch (error) {
      console.error('🔥 Sign out process failed:', error);
      throw error;
    }
  },

  async resetPassword(email: string) {
    console.log('🔥 Resetting password for:', email);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('🔥 Reset password error:', error);
        throw error;
      }
      console.log('🔥 Reset password email sent');
    } catch (error) {
      console.error('🔥 Reset password process failed:', error);
      throw error;
    }
  }
};
