import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash, FileText } from 'lucide-react';
import { TableSkeleton } from '@/components/ui/skeleton-loader';

interface Client {
  id: string;
  name: string;
  file_no: string;
  primary_email?: string;
  primary_mobile?: string;
  status: string;
  client_type: string;
  created_at: string;
}

interface ClientListTableProps {
  clients: Client[];
  isLoading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  onViewDocuments: (clientId: string) => void;
}

const ClientListTable: React.FC<ClientListTableProps> = ({
  clients,
  isLoading,
  onEdit,
  onDelete,
  onViewDocuments,
}) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return <TableSkeleton rows={5} columns={6} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>File No</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Mobile</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              No clients found. Add a new client to get started.
            </TableCell>
          </TableRow>
        ) : (
          clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.file_no}</TableCell>
              <TableCell>{client.primary_email || '-'}</TableCell>
              <TableCell>{client.primary_mobile || '-'}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(client.status)}>
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell>{client.client_type}</TableCell>
              <TableCell>{formatDate(client.created_at)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(client)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDocuments(client.id)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(client)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ClientListTable;