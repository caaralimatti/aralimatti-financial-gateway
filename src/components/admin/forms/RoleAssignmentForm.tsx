
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'staff' | 'client' | 'super_admin';

interface RoleAssignmentFormProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  showSuperAdmin?: boolean;
}

const RoleAssignmentForm = ({ role, onRoleChange, showSuperAdmin = false }: RoleAssignmentFormProps) => {
  const { profile } = useAuth();
  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Role Assignment</h3>
      <div className="space-y-2">
        <Label htmlFor="role">User Role *</Label>
        <Select value={role} onValueChange={onRoleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select user role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff Member</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            {(showSuperAdmin || isSuperAdmin) && (
              <SelectItem value="super_admin">Super Admin</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RoleAssignmentForm;
