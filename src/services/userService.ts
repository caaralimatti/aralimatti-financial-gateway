
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/userManagement';

export const userService = {
  async fetchUsers(): Promise<UserProfile[]> {
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

  async updateUserProfile(userData: { id: string; fullName?: string; role?: 'admin' | 'staff' | 'client'; isActive?: boolean }) {
    console.log('Updating user profile:', userData);
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
    console.log('User profile updated successfully:', data);
    return data;
  },

  async deleteUserProfile(userId: string) {
    console.log('Deleting user profile:', userId);
    
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Profile deletion error:', profileError);
      throw profileError;
    }
    console.log('User profile deleted successfully');
  }
};
