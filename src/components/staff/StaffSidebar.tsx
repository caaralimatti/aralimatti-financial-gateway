
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Users, 
  Settings,
  Award
} from 'lucide-react';

interface StaffSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { state } = useSidebar();

  const sidebarItems = [
    { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', title: 'Clients', icon: Users },
    { id: 'documents', title: 'Documents', icon: FileText },
    { id: 'tasks', title: 'Tasks', icon: CheckSquare },
    { id: 'dsc', title: 'DSC Management', icon: Award },
    { id: 'settings', title: 'Settings', icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="text-white text-sm font-bold h-4 w-4" />
          </div>
          {state === 'expanded' && (
            <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              Staff Portal
            </span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full justify-start"
                    tooltip={state === 'collapsed' ? item.title : undefined}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
          {state === 'expanded' && <span className="truncate">Online</span>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StaffSidebar;
