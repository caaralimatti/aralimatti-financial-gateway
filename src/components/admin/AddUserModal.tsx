
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import BasicDetailsForm from './forms/BasicDetailsForm';
import RoleAssignmentForm from './forms/RoleAssignmentForm';
import ContactInformationForm from './forms/ContactInformationForm';
import StatusToggleForm from './forms/StatusToggleForm';
import AddUserModalFooter from './forms/AddUserModalFooter';
import { useAddUserForm } from '@/hooks/useAddUserForm';
import { useAuth } from '@/contexts/AuthContext';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onOpenChange }) => {
  const { profile } = useAuth();
  
  const {
    formData,
    showPassword,
    showConfirmPassword,
    isCreating,
    setShowPassword,
    setShowConfirmPassword,
    handleFormDataChange,
    handleSave,
    handleCancel,
  } = useAddUserForm(() => onOpenChange(false));

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
            onRoleChange={(role) => handleFormDataChange({ role })}
            showSuperAdmin={profile?.role === 'super_admin'}
          />

          <ContactInformationForm
            formData={{
              phone: formData.phone,
              address: formData.address,
            }}
            onFormDataChange={handleFormDataChange}
          />

          <StatusToggleForm
            isActive={formData.status}
            onIsActiveChange={(status) => handleFormDataChange({ status })}
          />
        </div>

        <AddUserModalFooter
          onCancel={handleCancel}
          onSave={handleSave}
          isCreating={isCreating}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
