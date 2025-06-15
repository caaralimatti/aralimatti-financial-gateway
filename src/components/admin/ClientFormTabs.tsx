
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicDetailsTab from './tabs/BasicDetailsTab';
import TaxDetailsTab from './tabs/TaxDetailsTab';
import ContactPersonsTab from './tabs/ContactPersonsTab';
import LoginDetailsTab from './tabs/LoginDetailsTab';
import CustomFieldsTab from './tabs/CustomFieldsTab';
import ClientGroupsTab from './tabs/ClientGroupsTab';
import AttachmentsTab from './tabs/AttachmentsTab';
import PortalUserTab from './tabs/PortalUserTab';
import type { ClientFormData } from '@/types/clientForm';

interface ClientFormTabsProps {
  clientForm: ClientFormData;
  setClientForm: (form: ClientFormData) => void;
  clientId?: string;
}

const ClientFormTabs = ({ clientForm, setClientForm, clientId }: ClientFormTabsProps) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-8">
        <TabsTrigger value="basic">Basic Details</TabsTrigger>
        <TabsTrigger value="tax">Tax Details</TabsTrigger>
        <TabsTrigger value="contacts">Contact Persons</TabsTrigger>
        <TabsTrigger value="login">Login Details</TabsTrigger>
        <TabsTrigger value="custom">Custom Fields</TabsTrigger>
        <TabsTrigger value="groups">Client Groups</TabsTrigger>
        <TabsTrigger value="portal">Portal User</TabsTrigger>
        <TabsTrigger value="attachments">Attachments</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <BasicDetailsTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>
      
      <TabsContent value="tax">
        <TaxDetailsTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>
      
      <TabsContent value="contacts">
        <ContactPersonsTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>
      
      <TabsContent value="login">
        <LoginDetailsTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>
      
      <TabsContent value="custom">
        <CustomFieldsTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>
      
      <TabsContent value="groups">
        <ClientGroupsTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>

      <TabsContent value="portal">
        <PortalUserTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>
      
      <TabsContent value="attachments">
        <AttachmentsTab 
          clientForm={clientForm} 
          setClientForm={setClientForm}
          clientId={clientId}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ClientFormTabs;
