
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { MODULE_DEFINITIONS, ModuleName } from '@/types/adminPermissions';

interface EditAdminPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminId: string | null;
}

const EditAdminPermissionsModal: React.FC<EditAdminPermissionsModalProps> = ({
  open,
  onOpenChange,
  adminId
}) => {
  const { adminUsers, fetchAdminPermissions, updatePermission, isUpdatingPermission } = useAdminPermissions();
  
  const selectedAdmin = adminUsers.find(admin => admin.id === adminId);
  const { data: permissions = [], isLoading } = fetchAdminPermissions(adminId || '');

  const getPermissionStatus = (moduleName: string): boolean => {
    const permission = permissions.find(p => p.module_name === moduleName);
    return permission?.is_enabled ?? true; // Default to enabled if not found
  };

  const handlePermissionToggle = (moduleName: string, enabled: boolean) => {
    if (!adminId) return;
    
    updatePermission({
      admin_profile_id: adminId,
      module_name: moduleName,
      is_enabled: enabled
    });
  };

  const moduleGroups = [
    {
      title: 'User & System Management',
      modules: ['user_management', 'system_settings'] as ModuleName[]
    },
    {
      title: 'Client Management',
      modules: [
        'client_management_parent',
        'client_management_list',
        'client_management_add',
        'client_management_import',
        'client_management_bulk_edit'
      ] as ModuleName[]
    },
    {
      title: 'Task Management',
      modules: [
        'task_management_parent',
        'task_management_overview',
        'task_management_calendar',
        'task_management_categories',
        'task_management_settings'
      ] as ModuleName[]
    },
    {
      title: 'Billing & Time Tracking',
      modules: [
        'billing_parent',
        'billing_invoices_list',
        'billing_time_tracking'
      ] as ModuleName[]
    },
    {
      title: 'Other Modules',
      modules: [
        'compliance_management',
        'announcements',
        'admin_activity_log',
        'dsc_management',
        'analytics'
      ] as ModuleName[]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Admin Permissions</DialogTitle>
          <DialogDescription>
            Configure module access for {selectedAdmin?.full_name || selectedAdmin?.email}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {moduleGroups.map((group, groupIndex) => (
              <Card key={groupIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">{group.title}</CardTitle>
                  <CardDescription>
                    Control access to {group.title.toLowerCase()} features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {group.modules.map((moduleName, moduleIndex) => (
                    <div key={moduleName}>
                      <div className="flex items-center justify-between">
                        <Label htmlFor={moduleName} className="text-sm font-medium">
                          {MODULE_DEFINITIONS[moduleName]}
                        </Label>
                        <Switch
                          id={moduleName}
                          checked={getPermissionStatus(moduleName)}
                          onCheckedChange={(checked) => handlePermissionToggle(moduleName, checked)}
                          disabled={isUpdatingPermission}
                        />
                      </div>
                      {moduleIndex < group.modules.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminPermissionsModal;
