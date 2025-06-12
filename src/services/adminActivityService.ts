
import { supabase } from '@/integrations/supabase/client';

export interface AdminActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  timestamp: string;
  ip_address?: string;
  metadata?: any;
  profiles?: {
    full_name?: string;
    email: string;
  };
}

export const adminActivityService = {
  async logActivity(
    activity_type: string,
    description: string,
    metadata?: any
  ): Promise<void> {
    console.log('🔥 Logging admin activity:', { activity_type, description });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('🔥 No authenticated user for activity logging');
        return;
      }

      const { error } = await supabase
        .from('admin_activity_log')
        .insert({
          user_id: user.id,
          activity_type,
          description,
          metadata: metadata ? JSON.stringify(metadata) : null,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('🔥 Error logging admin activity:', error);
        throw error;
      }

      console.log('🔥 Admin activity logged successfully');
    } catch (error) {
      console.error('🔥 Error in logActivity:', error);
    }
  },

  async fetchRecentActivities(limit: number = 10): Promise<AdminActivity[]> {
    console.log('🔥 Fetching recent admin activities');
    
    const { data, error } = await supabase
      .from('admin_activity_log')
      .select(`
        *,
        profiles!admin_activity_log_user_id_fkey (
          full_name,
          email
        )
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('🔥 Error fetching admin activities:', error);
      throw error;
    }

    return data || [];
  }
};
