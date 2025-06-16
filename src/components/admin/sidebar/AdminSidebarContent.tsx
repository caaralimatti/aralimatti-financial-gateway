
import React from 'react';
import { SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Megaphone,
  KeyRound,
  Receipt,
  Shield,
  Workflow
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUserPermissions } from '@/hooks/useAdminPermissions';
import ClientsDropdown from './ClientsDropdown';
import TaskManagementDropdown from './TaskManagementDropdown';
import BillingDropdown from './BillingDropdown';

interface AdminSidebarContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebarContent: React.FC<AdminSidebarContentProps> = ({ activeTab, setActiveTab }) => {
  const { profile } = useAuth();
  const { data: permissions = {} } = useCurrentUserPermissions();

  const isSuperAdmin = profile?.role === 'super_admin';
  const isAdmin = profile?.role === 'admin';

  // Helper function to check if a module is enabled
  const isModuleEnabled = (moduleName: string): boolean => {
    if (isSuperAdmin) return true; // Super admins have access to everything
    if (!isAdmin) return false; // Non-admins have no access
    return permissions[moduleName] !== false; // Default to true if not explicitly disabled
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, alwaysVisible: true },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: Users, 
      module: 'user_management' 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      module: 'analytics' 
    },
    { 
      id: 'automation', 
      label: 'Automation', 
      icon: Workflow, 
      module: 'automation' 
    },
    { 
      id: 'dsc', 
      label: 'DSC Management', 
      icon: KeyRound, 
      module: 'dsc_management' 
    },
    { 
      id: 'announcements', 
      label: 'Announcements', 
      icon: Megaphone, 
      module: 'announcements' 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      module: 'system_settings' 
    },
  ];

  // Add admin permissions management for super admins only
  if (isSuperAdmin) {
    menuItems.splice(-1, 0, {
      id: 'admin-permissions',
      label: 'Admin Permissions',
      icon: Shield,
      alwaysVisible: true
    });
  }

  return (
    <SidebarContent>
      <SidebarMenu>
        {menuItems.map((item) => {
          // Check if item should be visible
          const shouldShow = item.alwaysVisible || 
            (item.module && isModuleEnabled(item.module));

          if (!shouldShow) return null;

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveTab(item.id)}
                isActive={activeTab === item.id}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
        
        {/* Billing Dropdown - only show if billing parent module is enabled */}
        {isModuleEnabled('billing_parent') && (
          <BillingDropdown activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        
        {/* Clients Dropdown - only show if client management parent module is enabled */}
        {isModuleEnabled('client_management_parent') && (
          <ClientsDropdown activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        
        {/* Task Management Dropdown - only show if task management parent module is enabled */}
        {isModuleEnabled('task_management_parent') && (
          <TaskManagementDropdown activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </SidebarMenu>
    </SidebarContent>
  );
};

export default AdminSidebarContent;
