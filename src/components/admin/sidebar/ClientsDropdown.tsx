
import React, { useState } from 'react';
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Users, ChevronDown, ChevronRight, UserPlus, List, Upload, Edit } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ClientsDropdownProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientsDropdown: React.FC<ClientsDropdownProps> = ({ activeTab, setActiveTab }) => {
  const [clientsOpen, setClientsOpen] = useState(false);

  return (
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
  );
};

export default ClientsDropdown;
