
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { Receipt, ChevronDown, FileText, Upload } from 'lucide-react';

interface BillingDropdownProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BillingDropdown: React.FC<BillingDropdownProps> = ({ activeTab, setActiveTab }) => {
  const billingItems = [
    { id: 'billing', label: 'Invoice Management', icon: FileText },
    { id: 'bulk-invoices', label: 'Bulk Invoices', icon: Upload },
  ];

  const isAnyBillingActive = billingItems.some(item => activeTab === item.id);

  return (
    <Collapsible defaultOpen={isAnyBillingActive}>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <div className="flex items-center">
              <Receipt className="mr-2 h-4 w-4" />
              Billing
            </div>
            <ChevronDown className="h-4 w-4" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {billingItems.map((item) => (
              <SidebarMenuSubItem key={item.id}>
                <SidebarMenuSubButton
                  onClick={() => setActiveTab(item.id)}
                  isActive={activeTab === item.id}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default BillingDropdown;
