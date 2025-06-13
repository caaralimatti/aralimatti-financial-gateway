
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
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FileText, 
  CheckSquare, 
  Calendar,
  User,
  Award,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ClientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { state } = useSidebar();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
    { id: 'documents', title: 'Documents', icon: FileText },
    { id: 'tasks', title: 'My Tasks', icon: CheckSquare },
    { id: 'calendar', title: 'Calendar', icon: Calendar },
    { id: 'profile', title: 'Profile', icon: User },
  ];

  // Conditionally add DSC tab if enabled for this client
  if (profile?.enable_dsc_tab) {
    sidebarItems.push({ id: 'dsc', title: 'DSC', icon: Award });
  }

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <User className="text-white text-sm font-bold h-4 w-4" />
          </div>
          {state === 'expanded' && (
            <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              Client Portal
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
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            {state === 'expanded' && <span className="truncate">Online</span>}
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-sm"
          >
            <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
            {state === 'expanded' ? 'Logout' : ''}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ClientSidebar;
