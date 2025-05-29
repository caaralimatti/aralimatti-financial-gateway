
import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarFooter
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
  LogIn
} from 'lucide-react';
import { Link } from 'react-router-dom';

const GSTSidebar: React.FC = () => {
  const sidebarItems = [
    { title: 'Dashboard', icon: LayoutDashboard, url: '/staff-dashboard', active: false },
    { title: 'Tasks', icon: CheckSquare, url: '#' },
    { title: 'Compliance Calendar', icon: Calendar, url: '#' },
    { title: 'Documents', icon: FileText, url: '#' },
    { title: 'Manage', icon: Users, url: '#' },
    { title: 'Master', icon: Database, url: '#' },
    { title: 'Messages', icon: MessageSquare, url: '#' },
    { title: 'Reports', icon: BarChart3, url: '#' },
    { title: 'Support & Help', icon: HelpCircle, url: '#' },
    { title: 'Settings', icon: Settings, url: '#' },
    { title: 'GST Login', icon: LogIn, url: '/gst-login', active: true },
    { title: 'Income Tax Login', icon: LogIn, url: '#' },
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
                isActive={item.active}
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
