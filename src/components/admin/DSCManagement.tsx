
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDSCManagement } from '@/hooks/useDSCManagement';
import { DSCCertificate } from '@/types/dsc';
import { format } from 'date-fns';
import AddDSCModal from './AddDSCModal';
import EditDSCModal from './EditDSCModal';
import DeleteDSCModal from './DeleteDSCModal';

const DSCManagement: React.FC = () => {
  const { dscCertificates, isLoading, error } = useDSCManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDSC, setSelectedDSC] = useState<DSCCertificate | null>(null);

  const filteredDSCs = dscCertificates.filter(dsc =>
    (dsc.serial_number && dsc.serial_number.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (dsc.certificate_holder_name && dsc.certificate_holder_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (dsc.issuing_authority && dsc.issuing_authority.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Expiring':
        return 'secondary';
      case 'Expired':
        return 'destructive';
      case 'Revoked':
        return 'destructive';
      case 'Lost':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleEdit = (dsc: DSCCertificate) => {
    setSelectedDSC(dsc);
    setShowEditModal(true);
  };

  const handleDelete = (dsc: DSCCertificate) => {
    setSelectedDSC(dsc);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading DSC Certificates</h2>
        <p className="text-gray-600">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>DSC Certificate Management</CardTitle>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add DSC Certificate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by serial number, holder name, or issuing authority..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Holder Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Issuing Authority</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact Phone</TableHead>
                  <TableHead>Storage Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDSCs.map((dsc) => (
                  <TableRow key={dsc.id}>
                    <TableCell className="font-medium">
                      {dsc.certificate_holder_name}
                    </TableCell>
                    <TableCell>{dsc.serial_number || 'N/A'}</TableCell>
                    <TableCell>{dsc.issuing_authority || 'N/A'}</TableCell>
                    <TableCell>
                      {format(new Date(dsc.valid_until), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(dsc.status)}>
                        {dsc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{dsc.contact_person_phone || 'N/A'}</TableCell>
                    <TableCell>{dsc.storage_location || 'Not specified'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(dsc)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(dsc)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDSCs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No DSC certificates found matching your search.' : 'No DSC certificates found.'}
            </div>
          )}
        </CardContent>
      </Card>

      <AddDSCModal open={showAddModal} onOpenChange={setShowAddModal} />
      <EditDSCModal 
        open={showEditModal} 
        onOpenChange={setShowEditModal} 
        dsc={selectedDSC} 
      />
      <DeleteDSCModal 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal} 
        dsc={selectedDSC} 
      />
    </div>
  );
};

export default DSCManagement;
