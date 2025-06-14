
import { supabase } from '@/integrations/supabase/client';

export interface SuperAdminAuditEntry {
  id: string;
  super_admin_id: string;
  action_type: string;
  target_resource?: string;
  target_id?: string;
  description: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

export const superAdminAuditService = {
  async logAction(entry: {
    action_type: string;
    target_resource?: string;
    target_id?: string;
    description: string;
    metadata?: any;
  }): Promise<void> {
    console.log('🔥 Logging super admin action:', entry);
    
    try {
      const { error } = await supabase
        .from('super_admin_audit_log')
        .insert({
          super_admin_id: (await supabase.auth.getUser()).data.user?.id || '',
          action_type: entry.action_type,
          target_resource: entry.target_resource,
          target_id: entry.target_id,
          description: entry.description,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
        });

      if (error) {
        console.error('🔥 Error logging super admin action:', error);
        throw error;
      }

      console.log('🔥 Super admin action logged successfully');
    } catch (error) {
      console.error('🔥 Error in logAction:', error);
      throw error;
    }
  },

  async fetchAuditLogs(): Promise<SuperAdminAuditEntry[]> {
    console.log('🔥 Fetching super admin audit logs');
    
    try {
      const { data, error } = await supabase
        .from('super_admin_audit_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('🔥 Error fetching audit logs:', error);
        throw error;
      }

      console.log('🔥 Fetched audit logs:', data);
      return data || [];
    } catch (error) {
      console.error('🔥 Error in fetchAuditLogs:', error);
      throw error;
    }
  }
};
