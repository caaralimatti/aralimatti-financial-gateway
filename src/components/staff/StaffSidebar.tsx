
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  FileText,
  Users,
  Database,
  MessageSquare,
  BarChart3,
  HelpCircle,
  Settings,
  LogIn,
  Calculator,
  ChevronRight,
  Eye,
  Upload,
  History
} from 'lucide-react';

interface StaffSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  incomeTaxOpen: boolean;
  setIncomeTaxOpen: (open: boolean) => void;
}

const StaffSidebar: React.FC<StaffSidebarProps> = ({
  activeTab,
  setActiveTab,
  incomeTaxOpen,
  setIncomeTaxOpen
}) => {
  const sidebarItems = [
    { title: 'Dashboard', icon: LayoutDashboard, id: 'dashboard', url: '/staff-dashboard' },
    { title: 'Tasks', icon: CheckSquare, id: 'tasks', url: '#' },
    { title: 'Compliance Calendar', icon: Calendar, id: 'calendar', url: '#' },
    { title: 'Documents', icon: FileText, id: 'documents', url: '#' },
    { title: 'Manage', icon: Users, id: 'manage', url: '#' },
    { title: 'Master', icon: Database, id: 'master', url: '#' },
    { title: 'Messages', icon: MessageSquare, id: 'messages', url: '#' },
    { title: 'Reports', icon: BarChart3, id: 'reports', url: '#' },
    { title: 'Support & Help', icon: HelpCircle, id: 'support', url: '#' },
    { title: 'Settings', icon: Settings, id: 'settings', url: '#' },
    { title: 'GST Login', icon: LogIn, id: 'gst-login', url: '/gst-login' },
  ];

  const incomeTaxSubItems = [
    { id: 'income-tax-quick', title: 'Quick Glance', icon: Eye },
    { id: 'file-itr-staff', title: 'File ITR', icon: Upload },
    { id: 'past-itr-staff', title: 'Past ITR Filings', icon: History },
  ];

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">CA</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">C A Aralimatti & Co</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeTab === item.id}
                    className="w-full justify-start"
                  >
                    {item.url === '#' ? (
                      <button 
                        className="flex items-center gap-3 px-3 py-2 w-full text-left"
                        onClick={() => setActiveTab(item.id)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Income Tax with submenu */}
              <SidebarMenuItem>
                <Collapsible open={incomeTaxOpen} onOpenChange={setIncomeTaxOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-start">
                      <Calculator className="h-4 w-4" />
                      <span>Income Tax</span>
                      <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${incomeTaxOpen ? 'rotate-90' : ''}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {incomeTaxSubItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            isActive={activeTab === subItem.id}
                            onClick={() => setActiveTab(subItem.id)}
                          >
                            <subItem.icon className="h-4 w-4" />
                            <span>{subItem.title}</span>
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
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Online</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StaffSidebar;
