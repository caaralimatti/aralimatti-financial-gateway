
import React, { useState } from 'react';
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart3, 
  Shield,
  Plus,
  List,
  Upload,
  Edit3,
  CheckSquare,
  ListTodo,
  Calendar,
  Settings2,
  ChevronRight,
  ChevronDown,
  FileText,
  Target
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { state } = useSidebar();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    clients: false,
    tasks: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sidebarItems = [
    { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-management', title: 'User Management', icon: Users },
    { id: 'system-settings', title: 'System Settings', icon: Settings },
    { id: 'analytics', title: 'Analytics', icon: BarChart3 },
  ];

  const clientSubItems = [
    { id: 'clients-add', title: 'Add Client', icon: Plus },
    { id: 'clients-list', title: 'Client List', icon: List },
    { id: 'clients-import', title: 'Import Clients', icon: Upload },
    { id: 'clients-bulk-edit', title: 'Bulk Edit', icon: Edit3 }
  ];

  const taskSubItems = [
    { id: 'tasks-overview', title: 'Task Overview', icon: Target },
    { id: 'tasks-list', title: 'All Tasks', icon: ListTodo },
    { id: 'tasks-calendar', title: 'Task Calendar', icon: Calendar },
    { id: 'tasks-categories', title: 'Categories', icon: FileText },
    { id: 'tasks-settings', title: 'Task Settings', icon: Settings2 }
  ];

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="text-white text-sm font-bold h-4 w-4" />
          </div>
          {state === 'expanded' && (
            <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
              Admin Portal
            </span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
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

              {/* Collapsible Clients Section */}
              <SidebarMenuItem>
                <Collapsible 
                  open={openSections.clients && state === 'expanded'} 
                  onOpenChange={() => toggleSection('clients')}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className="w-full justify-start"
                      tooltip={state === 'collapsed' ? 'Clients' : undefined}
                    >
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Clients</span>
                      {state === 'expanded' && (
                        openSections.clients ? (
                          <ChevronDown className="h-4 w-4 ml-auto flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                        )
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {clientSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            isActive={activeTab === subItem.id}
                            onClick={() => setActiveTab(subItem.id)}
                          >
                            <subItem.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              {/* Collapsible Tasks Section */}
              <SidebarMenuItem>
                <Collapsible 
                  open={openSections.tasks && state === 'expanded'} 
                  onOpenChange={() => toggleSection('tasks')}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className="w-full justify-start"
                      tooltip={state === 'collapsed' ? 'Task Management' : undefined}
                    >
                      <CheckSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Task Management</span>
                      {state === 'expanded' && (
                        openSections.tasks ? (
                          <ChevronDown className="h-4 w-4 ml-auto flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-4 w-4 ml-auto flex-shrink-0" />
                        )
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {taskSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            isActive={activeTab === subItem.id}
                            onClick={() => setActiveTab(subItem.id)}
                          >
                            <subItem.icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
          {state === 'expanded' && <span className="truncate">System Online</span>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
