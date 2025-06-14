
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
  Receipt
} from 'lucide-react';
import ClientsDropdown from './ClientsDropdown';
import TaskManagementDropdown from './TaskManagementDropdown';
import BillingDropdown from './BillingDropdown';

interface AdminSidebarContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebarContent: React.FC<AdminSidebarContentProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'dsc', label: 'DSC Management', icon: KeyRound },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <SidebarContent>
      <SidebarMenu>
        {menuItems.map((item) => (
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
        ))}
        
        <BillingDropdown activeTab={activeTab} setActiveTab={setActiveTab} />
        <ClientsDropdown activeTab={activeTab} setActiveTab={setActiveTab} />
        <TaskManagementDropdown activeTab={activeTab} setActiveTab={setActiveTab} />
      </SidebarMenu>
    </SidebarContent>
  );
};

export default AdminSidebarContent;
