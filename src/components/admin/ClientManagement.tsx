
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Edit, Users, Search, Trash, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useClients } from '@/hooks/useClients';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AddClientModal from './AddClientModal';
import DeleteClientModal from './DeleteClientModal';

interface ClientManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ activeTab, setActiveTab }) => {
  const { clients, isLoading } = useClients();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState<{ id: string; name: string } | null>(null);

  const filteredClients = clients?.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.file_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.primary_email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Inactive':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleDelete = (client: any) => {
    setDeletingClient({ id: client.id, name: client.name });
  };

  const handleManageDocuments = (client: any) => {
    // Navigate to manage documents with the selected client
    setActiveTab('manage-documents');
    // You could also store the selected client ID in a parent state if needed
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingClient(null);
  };

  const handleCloseDeleteModal = () => {
    setDeletingClient(null);
  };

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
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </CardContent>
          </Card>
        );
      case 'clients-list':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Client List
                </CardTitle>
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, file number, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.file_no}</TableCell>
                          <TableCell>{client.name}</TableCell>
                          <TableCell>{client.primary_email || 'N/A'}</TableCell>
                          <TableCell>{client.primary_mobile || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {client.client_type || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(client.status)}>
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(client)}
                                title="Edit Client"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleManageDocuments(client)}
                                title="Manage Documents"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDelete(client)}
                                className="text-destructive hover:text-destructive"
                                title="Delete Client"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredClients.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {searchQuery ? 'No clients found matching your search.' : 'No clients found.'}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Client Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('clients-add')}
              >
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Add Client</h3>
                  <p className="text-sm text-gray-600">Create new client profile</p>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('clients-list')}
              >
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">View Clients</h3>
                  <p className="text-sm text-gray-600">Browse all clients</p>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('import-clients')}
              >
                <CardContent className="p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Import</h3>
                  <p className="text-sm text-gray-600">Bulk import clients</p>
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setActiveTab('bulk-edit')}
              >
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
      <AddClientModal 
        open={showAddModal} 
        onOpenChange={handleCloseModal}
        editingClient={editingClient}
      />
      <DeleteClientModal
        open={!!deletingClient}
        onOpenChange={handleCloseDeleteModal}
        client={deletingClient}
      />
    </div>
  );
};

export default ClientManagement;
