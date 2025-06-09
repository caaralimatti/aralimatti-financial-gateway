
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BasicDetailsForm from './forms/BasicDetailsForm';
import RoleAssignmentForm from './forms/RoleAssignmentForm';
import ContactInformationForm from './forms/ContactInformationForm';
import StatusToggleForm from './forms/StatusToggleForm';
import { useUserManagement } from '@/hooks/useUserManagement';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onOpenChange }) => {
  const { createUser, isCreating } = useUserManagement();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' as 'admin' | 'staff' | 'client',
    phone: '',
    address: '',
    status: true,
  });

  const handleSave = async () => {
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    try {
      await createUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        isActive: formData.status,
      });

      // Reset form and close modal
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client',
        phone: '',
        address: '',
        status: true,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleCancel = () => {
    // Reset form and close modal
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'client',
      phone: '',
      address: '',
      status: true,
    });
    onOpenChange(false);
  };

  const handleFormDataChange = (newData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <BasicDetailsForm
            formData={{
              fullName: formData.fullName,
              email: formData.email,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
            }}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onFormDataChange={handleFormDataChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <RoleAssignmentForm
            role={formData.role}
            onRoleChange={(role) => handleFormDataChange({ role: role as 'admin' | 'staff' | 'client' })}
          />

          <ContactInformationForm
            formData={{
              phone: formData.phone,
              address: formData.address,
            }}
            onFormDataChange={handleFormDataChange}
          />

          <StatusToggleForm
            status={formData.status}
            onStatusChange={(status) => handleFormDataChange({ status })}
          />
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Save User'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
