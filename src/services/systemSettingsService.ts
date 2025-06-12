
import { supabase } from '@/integrations/supabase/client';

export interface SystemSetting {
  key: string;
  value: any;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const systemSettingsService = {
  async fetchSettings(): Promise<SystemSetting[]> {
    console.log('🔥 Fetching system settings');
    
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('key');

    if (error) {
      console.error('🔥 Error fetching system settings:', error);
      throw error;
    }

    return data || [];
  },

  async updateSetting(key: string, value: any): Promise<void> {
    console.log('🔥 Updating system setting:', { key, value });
    
    const { error } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value: JSON.stringify(value),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('🔥 Error updating system setting:', error);
      throw error;
    }
  },

  async getSetting(key: string): Promise<any> {
    console.log('🔥 Getting system setting:', key);
    
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .limit(1);

    if (error) {
      console.error('🔥 Error getting system setting:', error);
      throw error;
    }

    return data && data.length > 0 ? data[0].value : null;
  }
};
