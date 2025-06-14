
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { CheckSquare, ChevronDown, BarChart3, Calendar, FolderOpen, Wrench } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUserPermissions } from '@/hooks/useAdminPermissions';

interface TaskManagementDropdownProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TaskManagementDropdown: React.FC<TaskManagementDropdownProps> = ({ activeTab, setActiveTab }) => {
  const { profile } = useAuth();
  const { data: permissions = {} } = useCurrentUserPermissions();

  const isSuperAdmin = profile?.role === 'super_admin';
  const isAdmin = profile?.role === 'admin';

  // Helper function to check if a module is enabled
  const isModuleEnabled = (moduleName: string): boolean => {
    if (isSuperAdmin) return true;
    if (!isAdmin) return false;
    return permissions[moduleName] !== false;
  };

  const taskItems = [
    { 
      id: 'task-overview', 
      label: 'Task Overview', 
      icon: BarChart3,
      module: 'task_management_overview'
    },
    { 
      id: 'tasks', 
      label: 'All Tasks', 
      icon: CheckSquare,
      module: 'task_management_overview'
    },
    { 
      id: 'task-calendar', 
      label: 'Task Calendar', 
      icon: Calendar,
      module: 'task_management_calendar'
    },
    { 
      id: 'categories', 
      label: 'Categories', 
      icon: FolderOpen,
      module: 'task_management_categories'
    },
    { 
      id: 'task-settings', 
      label: 'Task Settings', 
      icon: Wrench,
      module: 'task_management_settings'
    },
  ];

  // Check if parent module is enabled
  if (!isModuleEnabled('task_management_parent')) {
    return null;
  }

  // Filter items based on permissions
  const visibleItems = taskItems.filter(item => isModuleEnabled(item.module));

  if (visibleItems.length === 0) return null;

  const isAnyTaskActive = visibleItems.some(item => activeTab === item.id);

  return (
    <Collapsible defaultOpen={isAnyTaskActive}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex items-center">
              <CheckSquare className="mr-2 h-4 w-4" />
              Task Management
            </div>
            <ChevronDown className="h-4 w-4" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {visibleItems.map((item) => (
              <SidebarMenuSubItem key={item.id}>
                <SidebarMenuSubButton
                  onClick={() => setActiveTab(item.id)}
                  isActive={activeTab === item.id}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default TaskManagementDropdown;
