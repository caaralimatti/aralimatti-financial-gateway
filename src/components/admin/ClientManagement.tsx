
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOptimizedClients } from '@/hooks/useOptimizedClients';
import ClientListHeader from './client/ClientListHeader';
import ClientListTable from './client/ClientListTable';
import AddClientModal from './AddClientModal';
import DeleteClientModal from './DeleteClientModal';

interface ClientManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ activeTab, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState<{ id: string; name: string } | null>(null);

  const filters = useMemo(() => ({
    search: searchQuery,
    status: statusFilter,
  }), [searchQuery, statusFilter]);

  const { clients, isLoading } = useOptimizedClients(filters);

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleDelete = (client: any) => {
    setDeletingClient({ id: client.id, name: client.name });
  };

  const handleViewDocuments = (clientId: string) => {
    setActiveTab('client-documents');
  };

  const handleImportClients = () => {
    setActiveTab('client-import');
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">Manage and organize all your clients</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ClientListHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddClient={() => setShowAddModal(true)}
            onImportClients={handleImportClients}
          />
          
          <ClientListTable
            clients={clients || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDocuments={handleViewDocuments}
          />
        </CardContent>
      </Card>

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
