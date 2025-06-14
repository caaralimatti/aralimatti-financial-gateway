
import { supabase } from '@/integrations/supabase/client';

export interface SuperAdminAuditEntry {
  id: string;
  super_admin_id: string;
  action_type: string;
  target_resource: string | null;
  target_id: string | null;
  description: string;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  timestamp: string;
}

export interface CreateAuditEntryData {
  action_type: string;
  target_resource?: string;
  target_id?: string;
  description: string;
  metadata?: Record<string, any>;
}

export const superAdminAuditService = {
  async logAction(data: CreateAuditEntryData): Promise<void> {
    try {
      console.log('Logging super admin action:', data);

      const { error } = await supabase
        .from('super_admin_audit_log')
        .insert({
          super_admin_id: (await supabase.auth.getUser()).data.user?.id || '',
          action_type: data.action_type,
          target_resource: data.target_resource || null,
          target_id: data.target_id || null,
          description: data.description,
          metadata: data.metadata || null,
          ip_address: null, // Could be enhanced to capture real IP
          user_agent: navigator.userAgent || null,
        });

      if (error) {
        console.error('Error logging super admin action:', error);
        throw error;
      }

      console.log('Super admin action logged successfully');
    } catch (error) {
      console.error('Error in logAction:', error);
      throw error;
    }
  },

  async getAuditLog(): Promise<SuperAdminAuditEntry[]> {
    try {
      console.log('Fetching super admin audit log...');

      const { data, error } = await supabase
        .from('super_admin_audit_log')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching audit log:', error);
        throw error;
      }

      console.log('Audit log fetched successfully:', data);
      return data.map(entry => ({
        ...entry,
        ip_address: entry.ip_address?.toString() || null,
      })) as SuperAdminAuditEntry[];
    } catch (error) {
      console.error('Error in getAuditLog:', error);
      throw error;
    }
  },

  async getAuditLogByUser(userId: string): Promise<SuperAdminAuditEntry[]> {
    try {
      console.log('Fetching audit log for user:', userId);

      const { data, error } = await supabase
        .from('super_admin_audit_log')
        .select('*')
        .eq('super_admin_id', userId)
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching user audit log:', error);
        throw error;
      }

      console.log('User audit log fetched successfully:', data);
      return data.map(entry => ({
        ...entry,
        ip_address: entry.ip_address?.toString() || null,
      })) as SuperAdminAuditEntry[];
    } catch (error) {
      console.error('Error in getAuditLogByUser:', error);
      throw error;
    }
  }
};
