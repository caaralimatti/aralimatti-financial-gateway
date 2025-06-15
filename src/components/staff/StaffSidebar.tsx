
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Users, 
  Settings, 
  User,
  LogOut,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StaffSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      key: 'dashboard',
    },
    {
      title: 'My Tasks',
      icon: CheckSquare,
      key: 'tasks',
    },
    {
      title: 'Reports',
      icon: FileText,
      key: 'reports',
    },
    {
      title: 'Clients',
      icon: Users,
      key: 'clients',
    },
    {
      title: 'DSC Management',
      icon: Shield,
      key: 'dsc',
    },
    {
      title: 'Manage Documents', // NEW
      icon: FileText,
      key: 'manage-documents',
    },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex flex-col items-center py-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="font-semibold text-sidebar-foreground">Staff Portal</h2>
          <p className="text-xs text-sidebar-foreground/60">
            {profile?.full_name || profile?.email}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.key)}
                    isActive={activeTab === item.key}
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab('profile')}
                  isActive={activeTab === 'profile'}
                  tooltip="Profile"
                >
                  <Settings className="h-4 w-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
export default StaffSidebar;
