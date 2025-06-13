
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  FileText, 
  Settings, 
  User,
  LogOut,
  Shield,
  Megaphone,
  ChevronDown,
  ChevronRight,
  UserPlus,
  List,
  Upload,
  Edit,
  BarChart3,
  Calendar,
  FolderOpen,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { signOut, profile } = useAuth();
  const [clientsOpen, setClientsOpen] = useState(false);
  const [taskManagementOpen, setTaskManagementOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex flex-col items-center py-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
            <User className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="font-semibold text-sidebar-foreground">Admin Portal</h2>
          <p className="text-xs text-sidebar-foreground/60">
            {profile?.full_name || profile?.email}
          </p>
        </div>
      </SidebarHeader>

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
              <SidebarMenuItem>
                <Collapsible open={clientsOpen} onOpenChange={setClientsOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Clients">
                      <Users className="h-4 w-4" />
                      <span>Clients</span>
                      {clientsOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('add-client')}
                          isActive={activeTab === 'add-client'}
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>Add Client</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('clients')}
                          isActive={activeTab === 'clients'}
                        >
                          <List className="h-4 w-4" />
                          <span>Client List</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('import-clients')}
                          isActive={activeTab === 'import-clients'}
                        >
                          <Upload className="h-4 w-4" />
                          <span>Import Clients</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('bulk-edit')}
                          isActive={activeTab === 'bulk-edit'}
                        >
                          <Edit className="h-4 w-4" />
                          <span>Bulk Edit</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Task Management Dropdown */}
              <SidebarMenuItem>
                <Collapsible open={taskManagementOpen} onOpenChange={setTaskManagementOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Task Management">
                      <CheckSquare className="h-4 w-4" />
                      <span>Task Management</span>
                      {taskManagementOpen ? <ChevronDown className="h-4 w-4 ml-auto" /> : <ChevronRight className="h-4 w-4 ml-auto" />}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('task-overview')}
                          isActive={activeTab === 'task-overview'}
                        >
                          <BarChart3 className="h-4 w-4" />
                          <span>Task Overview</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('tasks')}
                          isActive={activeTab === 'tasks'}
                        >
                          <CheckSquare className="h-4 w-4" />
                          <span>All Tasks</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('task-calendar')}
                          isActive={activeTab === 'task-calendar'}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Task Calendar</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('categories')}
                          isActive={activeTab === 'categories'}
                        >
                          <FolderOpen className="h-4 w-4" />
                          <span>Categories</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          onClick={() => setActiveTab('task-settings')}
                          isActive={activeTab === 'task-settings'}
                        >
                          <Wrench className="h-4 w-4" />
                          <span>Task Settings</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
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

export default AdminSidebar;
