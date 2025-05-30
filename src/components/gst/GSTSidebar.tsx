
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
  SidebarMenuSubButton
} from '@/components/ui/sidebar';
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
  ChevronDown,
  ChevronRight,
  UserPlus,
  FileSpreadsheet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const GSTSidebar: React.FC = () => {
  const location = useLocation();
  const [isGSTMenuOpen, setIsGSTMenuOpen] = useState(
    location.pathname.startsWith('/gst-')
  );

  const sidebarItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/staff-dashboard' },
    { title: 'Tasks', icon: CheckSquare, url: '/tasks' },
    { title: 'Compliance Calendar', icon: Calendar, url: '#' },
    { title: 'Documents', icon: FileText, url: '#' },
    { title: 'Manage', icon: Users, url: '#' },
    { title: 'Master', icon: Database, url: '#' },
    { title: 'Messages', icon: MessageSquare, url: '#' },
    { title: 'Reports', icon: BarChart3, url: '#' },
    { title: 'Support & Help', icon: HelpCircle, url: '#' },
    { title: 'Settings', icon: Settings, url: '#' },
    { title: 'Income Tax Login', icon: LogIn, url: '#' },
  ];

  const gstSubMenuItems = [
    { title: 'Login', icon: LogIn, url: '/gst-login' },
    { title: 'Registration', icon: UserPlus, url: '/gst-registration' },
    { title: 'Reports', icon: FileSpreadsheet, url: '/gst-reports' },
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
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                asChild
                isActive={location.pathname === item.url}
                className="w-full justify-start"
              >
                {item.url === '#' ? (
                  <button className="flex items-center gap-3 px-3 py-2 w-full text-left">
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
          
          {/* GST Login Collapsible Section */}
          <SidebarMenuItem>
            <Collapsible open={isGSTMenuOpen} onOpenChange={setIsGSTMenuOpen}>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="w-full justify-start">
                  <LogIn className="h-4 w-4" />
                  <span>GST Login</span>
                  {isGSTMenuOpen ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {gstSubMenuItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton 
                        asChild
                        isActive={location.pathname === subItem.url}
                      >
                        <Link to={subItem.url} className="flex items-center gap-3">
                          <subItem.icon className="h-4 w-4" />
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
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

export default GSTSidebar;
