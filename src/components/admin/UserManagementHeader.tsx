
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface UserManagementHeaderProps {
  onAddUser: () => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  onAddUser,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage all users and their roles</p>
      </div>
      <Button onClick={onAddUser} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add New User
      </Button>
    </div>
  );
};

export default UserManagementHeader;
