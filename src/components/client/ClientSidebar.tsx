
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
  FileText, 
  Calculator,
  Receipt,
  CreditCard,
  User
} from 'lucide-react';

interface ClientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ activeTab, setActiveTab }) => {
  const sidebarItems = [
    { id: 'overview', title: 'Overview', icon: LayoutDashboard },
    { id: 'documents', title: 'Documents', icon: FileText },
    { id: 'gst-registration', title: 'GST Registration', icon: Receipt },
    { id: 'income-tax', title: 'Income Tax', icon: Calculator },
    { id: 'billing', title: 'Billing', icon: CreditCard },
  ];

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">CA</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">Client Portal</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton 
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full justify-start"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
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

export default ClientSidebar;
