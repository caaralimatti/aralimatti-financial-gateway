
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Shield } from 'lucide-react';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import EditAdminPermissionsModal from './EditAdminPermissionsModal';

const AdminPermissionsManagement: React.FC = () => {
  const { adminUsers, isLoadingUsers, usersError } = useAdminPermissions();
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditPermissions = (adminId: string) => {
    setSelectedAdminId(adminId);
    setShowEditModal(true);
  };

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Admin Users</h2>
        <p className="text-gray-600">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Permissions</h1>
          <p className="text-muted-foreground">
            Manage module access permissions for Admin users
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Users
          </CardTitle>
          <CardDescription>
            Configure which modules each Admin user can access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adminUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No admin users found.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        {admin.full_name || 'No name provided'}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          admin.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPermissions(admin.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Permissions
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <EditAdminPermissionsModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        adminId={selectedAdminId}
      />
    </div>
  );
};

export default AdminPermissionsManagement;
