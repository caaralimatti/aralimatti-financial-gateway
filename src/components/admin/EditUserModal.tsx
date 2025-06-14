import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserProfile } from '@/types/userManagement';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useAuth } from '@/contexts/AuthContext';
import RoleAssignmentForm from './forms/RoleAssignmentForm';

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onOpenChange, user }) => {
  const { updateUser, sendPasswordReset, isUpdating, isSendingReset } = useUserManagement();
  const { profile } = useAuth();
  // Explicitly declare possible roles including "super_admin"
  const [formData, setFormData] = useState<{
    fullName: string;
    role: 'admin' | 'staff' | 'client' | 'super_admin';
    isActive: boolean;
  }>({
    fullName: '',
    role: 'client',
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        role: user.role,
        isActive: user.is_active,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateUser({
        id: user.id,
        fullName: formData.fullName,
        role: formData.role,
        isActive: formData.isActive,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handlePasswordReset = async () => {
    if (!user) return;

    try {
      await sendPasswordReset(user.email);
    } catch (error) {
      console.error('Error sending password reset:', error);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-100"
            />
            <p className="text-sm text-gray-500">Email cannot be changed directly</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">User Role *</Label>
            <RoleAssignmentForm
              role={formData.role}
              onRoleChange={(role) =>
                setFormData((prev) => ({ ...prev, role }))
              }
              showSuperAdmin={profile?.role === 'super_admin'}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: checked,
                }))
              }
            />
            <Label htmlFor="isActive">Active User</Label>
          </div>

          <div className="space-y-2">
            <Label>Password Management</Label>
            <Button
              type="button"
              variant="outline"
              onClick={handlePasswordReset}
              disabled={isSendingReset}
              className="w-full"
            >
              {isSendingReset ? 'Sending...' : 'Send Password Reset Email'}
            </Button>
            <p className="text-sm text-gray-500">
              This will send a password reset email to the user
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
