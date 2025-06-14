
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Users, ChevronDown, UserPlus, List, Upload, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUserPermissions } from '@/hooks/useAdminPermissions';

interface ClientsDropdownProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientsDropdown: React.FC<ClientsDropdownProps> = ({ activeTab, setActiveTab }) => {
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

  const clientItems = [
    { 
      id: 'clients', 
      label: 'Client Management', 
      icon: Users,
      module: 'client_management_list'
    },
    { 
      id: 'clients-add', 
      label: 'Add Client', 
      icon: UserPlus,
      module: 'client_management_add'
    },
    { 
      id: 'clients-list', 
      label: 'Client List', 
      icon: List,
      module: 'client_management_list'
    },
    { 
      id: 'import-clients', 
      label: 'Import Clients', 
      icon: Upload,
      module: 'client_management_import'
    },
    { 
      id: 'bulk-edit', 
      label: 'Bulk Edit', 
      icon: Edit,
      module: 'client_management_bulk_edit'
    },
  ];

  // Check if parent module is enabled
  if (!isModuleEnabled('client_management_parent')) {
    return null;
  }

  // Filter items based on permissions
  const visibleItems = clientItems.filter(item => isModuleEnabled(item.module));

  if (visibleItems.length === 0) return null;

  const isAnyClientActive = visibleItems.some(item => activeTab === item.id);

  return (
    <Collapsible defaultOpen={isAnyClientActive}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Clients
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

export default ClientsDropdown;
