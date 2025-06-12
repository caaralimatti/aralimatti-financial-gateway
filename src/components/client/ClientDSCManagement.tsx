
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useClientDSCCertificates } from '@/hooks/useDSCManagement';
import { format } from 'date-fns';

const ClientDSCManagement: React.FC = () => {
  const { user } = useAuth();
  const { data: dscCertificates = [], isLoading, error } = useClientDSCCertificates(user?.id || '');

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
          <CardTitle>My DSC Certificates</CardTitle>
        </CardHeader>
        <CardContent>
          {dscCertificates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No DSC certificates found for your account.
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Issuing Authority</TableHead>
                    <TableHead>Valid From</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dscCertificates.map((dsc) => (
                    <TableRow key={dsc.id}>
                      <TableCell className="font-medium">{dsc.serial_number}</TableCell>
                      <TableCell>{dsc.issuing_authority}</TableCell>
                      <TableCell>
                        {format(new Date(dsc.valid_from), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(dsc.valid_until), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(dsc.status)}>
                          {dsc.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(dsc.received_date), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDSCManagement;
