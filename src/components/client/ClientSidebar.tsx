
import React from 'react';
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
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  FileText, 
  Calculator,
  Receipt,
  CreditCard,
  ChevronRight,
  Eye,
  Upload,
  History
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ClientSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { state } = useSidebar();
  const [incomeTaxOpen, setIncomeTaxOpen] = React.useState(false);

  const sidebarItems = [
    { id: 'overview', title: 'Overview', icon: LayoutDashboard },
    { id: 'documents', title: 'Documents', icon: FileText },
    { id: 'gst-registration', title: 'GST', icon: Receipt },
    { id: 'billing', title: 'Billing', icon: CreditCard },
  ];

  const incomeTaxSubItems = [
    { id: 'income-tax-quick-glance', title: 'Quick Glance', icon: Eye },
    { id: 'file-itr', title: 'File ITR', icon: Upload },
    { id: 'past-itr', title: 'Past ITR Filings', icon: History },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 dark:border-gray-700">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">CA</span>
          </div>
          {state === "expanded" && (
            <span className="font-semibold text-gray-900 dark:text-white">Client Portal</span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    {state === "expanded" && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Income Tax with submenu */}
              <SidebarMenuItem>
                <Collapsible open={incomeTaxOpen} onOpenChange={setIncomeTaxOpen}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-start">
                      <Calculator className="h-4 w-4" />
                      {state === "expanded" && (
                        <>
                          <span>Income Tax</span>
                          <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${incomeTaxOpen ? 'rotate-90' : ''}`} />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
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
                  )}
                </Collapsible>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {state === "expanded" && <span>Online</span>}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ClientSidebar;
