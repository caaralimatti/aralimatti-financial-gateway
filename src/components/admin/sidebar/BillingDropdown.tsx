
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { Receipt, ChevronDown, FileText, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUserPermissions } from '@/hooks/useAdminPermissions';

interface BillingDropdownProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BillingDropdown: React.FC<BillingDropdownProps> = ({ activeTab, setActiveTab }) => {
  const { profile } = useAuth();
  const { data: permissions = {} } = useCurrentUserPermissions();

  const isSuperAdmin = profile?.role === 'super_admin';
  const isAdmin = profile?.role === 'admin';

  // Helper function to check if a module is enabled
  const isModuleEnabled = (moduleName: string): boolean => {
    if (isSuperAdmin) return true;
    if (!isAdmin) return false;
    return permissions[moduleName] !== false;
  };

  const billingItems = [
    { 
      id: 'billing', 
      label: 'Invoice Management', 
      icon: FileText,
      module: 'billing_invoices_list'
    },
    { 
      id: 'bulk-invoices', 
      label: 'Bulk Invoices', 
      icon: Upload,
      module: 'billing_invoices_list' // Using same permission as invoice management
    },
  ];

  // Filter items based on permissions
  const visibleItems = billingItems.filter(item => isModuleEnabled(item.module));

  if (visibleItems.length === 0) return null;

  const isAnyBillingActive = visibleItems.some(item => activeTab === item.id);

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
            {visibleItems.map((item) => (
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
