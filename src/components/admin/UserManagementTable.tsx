
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import UserTableRow from './UserTableRow';
import { UserProfile } from '@/types/userManagement';

interface UserManagementTableProps {
  users: UserProfile[];
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  onEdit,
  onDelete,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagementTable;
