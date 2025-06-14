
export interface AdminModulePermission {
  id: string;
  admin_profile_id: string;
  module_name: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminPermissionUpdate {
  admin_profile_id: string;
  module_name: string;
  is_enabled: boolean;
}

export const MODULE_DEFINITIONS = {
  user_management: 'User Management',
  system_settings: 'System Settings',
  client_management_parent: 'Client Management (Parent)',
  client_management_list: 'Client List View',
  client_management_add: 'Add Client',
  client_management_import: 'Import Clients',
  client_management_bulk_edit: 'Bulk Edit Clients',
  task_management_parent: 'Task Management (Parent)',
  task_management_overview: 'All Tasks Overview',
  task_management_calendar: 'Task Calendar',
  task_management_categories: 'Task Categories',
  task_management_settings: 'Task Settings',
  compliance_management: 'Compliance Management',
  announcements: 'Announcements',
  admin_activity_log: 'Admin Activity Log',
  dsc_management: 'DSC Management',
  analytics: 'Analytics',
  billing_parent: 'Billing (Parent)',
  billing_invoices_list: 'Billing/Invoices List',
  billing_time_tracking: 'Time Tracking'
} as const;

export type ModuleName = keyof typeof MODULE_DEFINITIONS;
