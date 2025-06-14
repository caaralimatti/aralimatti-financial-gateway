
import { supabase } from '@/integrations/supabase/client';
import { AdminModulePermission, AdminPermissionUpdate } from '@/types/adminPermissions';

export const adminPermissionsService = {
  async fetchAdminUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, is_active')
      .eq('role', 'admin')
      .eq('is_active', true)
      .order('full_name');

    if (error) throw error;
    return data;
  },

  async fetchAdminPermissions(adminProfileId: string): Promise<AdminModulePermission[]> {
    const { data, error } = await supabase
      .from('admin_module_permissions')
      .select('*')
      .eq('admin_profile_id', adminProfileId)
      .order('module_name');

    if (error) throw error;
    return data as AdminModulePermission[];
  },

  async updateAdminPermission(update: AdminPermissionUpdate) {
    const { data, error } = await supabase
      .from('admin_module_permissions')
      .upsert({
        admin_profile_id: update.admin_profile_id,
        module_name: update.module_name,
        is_enabled: update.is_enabled,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'admin_profile_id,module_name'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async fetchCurrentUserPermissions(): Promise<Record<string, boolean>> {
    const { data, error } = await supabase
      .from('admin_module_permissions')
      .select('module_name, is_enabled')
      .eq('admin_profile_id', (await supabase.auth.getUser()).data.user?.id);

    if (error) throw error;
    
    const permissions: Record<string, boolean> = {};
    data?.forEach(permission => {
      permissions[permission.module_name] = permission.is_enabled;
    });
    
    return permissions;
  }
};
