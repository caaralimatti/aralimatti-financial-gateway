
import React from 'react';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Shield, Megaphone, Settings, BarChart3 } from 'lucide-react';
import ClientsDropdown from './ClientsDropdown';
import TaskManagementDropdown from './TaskManagementDropdown';

interface AdminSidebarContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebarContent: React.FC<AdminSidebarContentProps> = ({ activeTab, setActiveTab }) => {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Dashboard */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab('dashboard')}
                isActive={activeTab === 'dashboard'}
                tooltip="Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* User Management */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab('users')}
                isActive={activeTab === 'users'}
                tooltip="User Management"
              >
                <Users className="h-4 w-4" />
                <span>User Management</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Clients Dropdown */}
            <ClientsDropdown activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Task Management Dropdown */}
            <TaskManagementDropdown activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Analytics */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab('analytics')}
                isActive={activeTab === 'analytics'}
                tooltip="Analytics & Reports"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* DSC Management */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab('dsc')}
                isActive={activeTab === 'dsc'}
                tooltip="DSC Management"
              >
                <Shield className="h-4 w-4" />
                <span>DSC Management</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Announcements */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab('announcements')}
                isActive={activeTab === 'announcements'}
                tooltip="Announcements"
              >
                <Megaphone className="h-4 w-4" />
                <span>Announcements</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* System Settings */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveTab('settings')}
                isActive={activeTab === 'settings'}
                tooltip="System Settings"
              >
                <Settings className="h-4 w-4" />
                <span>System Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default AdminSidebarContent;
