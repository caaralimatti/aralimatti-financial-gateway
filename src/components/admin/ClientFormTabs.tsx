import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicDetailsTab from './tabs/BasicDetailsTab';
import TaxDetailsTab from './tabs/TaxDetailsTab';
import ContactPersonsTab from './tabs/ContactPersonsTab';
import ClientGroupsTab from './tabs/ClientGroupsTab';
import CustomFieldsTab from './tabs/CustomFieldsTab';
import LoginDetailsTab from './tabs/LoginDetailsTab';
import AttachmentsTab from './tabs/AttachmentsTab';

interface ClientFormTabsProps {
  clientForm: any;
  setClientForm: (form: any) => void;
}

const ClientFormTabs = ({ clientForm, setClientForm }: ClientFormTabsProps) => {
  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-7">
        <TabsTrigger value="basic">Basic Details</TabsTrigger>
        <TabsTrigger value="tax-details">Tax Details</TabsTrigger>
        <TabsTrigger value="contact">Contact Persons</TabsTrigger>
        <TabsTrigger value="groups">Client Groups</TabsTrigger>
        <TabsTrigger value="custom">Custom Fields</TabsTrigger>
        <TabsTrigger value="login">Login Details</TabsTrigger>
        <TabsTrigger value="attachments">Attachments</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <BasicDetailsTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>

      <TabsContent value="tax-details">
        <TaxDetailsTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>

      <TabsContent value="contact">
        <ContactPersonsTab />
      </TabsContent>

      <TabsContent value="groups">
        <ClientGroupsTab />
      </TabsContent>

      <TabsContent value="custom">
        <CustomFieldsTab />
      </TabsContent>

      <TabsContent value="login">
        <LoginDetailsTab clientForm={clientForm} setClientForm={setClientForm} />
      </TabsContent>

      <TabsContent value="attachments">
        <AttachmentsTab />
      </TabsContent>
    </Tabs>
  );
};

export default ClientFormTabs;
