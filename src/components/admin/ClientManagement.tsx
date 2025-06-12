
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Edit, Users } from 'lucide-react';

interface ClientManagementProps {
  activeTab: string;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'clients-add':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Add new client form will be implemented here.</p>
            </CardContent>
          </Card>
        );
      case 'clients-list':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Client List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Client list table will be implemented here.</p>
            </CardContent>
          </Card>
        );
      case 'clients-import':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Client import functionality will be implemented here.</p>
            </CardContent>
          </Card>
        );
      case 'clients-bulk-edit':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Bulk Edit Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Bulk edit functionality will be implemented here.</p>
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Client Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Add Client</h3>
                  <p className="text-sm text-gray-600">Create new client profile</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">View Clients</h3>
                  <p className="text-sm text-gray-600">Browse all clients</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Import</h3>
                  <p className="text-sm text-gray-600">Bulk import clients</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Edit className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Bulk Edit</h3>
                  <p className="text-sm text-gray-600">Edit multiple clients</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default ClientManagement;
