import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BasicDetailsForm from './forms/BasicDetailsForm';
import RoleAssignmentForm, { UserRole } from './forms/RoleAssignmentForm';
import ContactInformationForm from './forms/ContactInformationForm';
import StatusToggleForm from './forms/StatusToggleForm';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ open, onOpenChange }) => {
  const { createUser, isCreating } = useUserManagement();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: UserRole;
    phone: string;
    address: string;
    status: boolean;
  }>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client',
    phone: '',
    address: '',
    status: true,
  });

  const resetForm = () => {
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
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSave = async () => {
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error", 
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Super admin role validation - only super admins can create other super admins
    if (formData.role === 'super_admin' && profile?.role !== 'super_admin') {
      toast({
        title: "Access Denied",
        description: "Only super admins can create super admin accounts",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating user with data:', {
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        isActive: formData.status,
      });

      await createUser({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        isActive: formData.status,
      });

      console.log('User created successfully, closing modal');
      
      // Reset form and close modal on success
      resetForm();
      onOpenChange(false);
      
      // Success toast will be shown by the hook
    } catch (error) {
      console.error('Error creating user:', error);
      // Error toast will be shown by the hook
    }
  };

  const handleCancel = () => {
    resetForm();
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
            onRoleChange={(role) =>
              setFormData((prev) => ({
                ...prev,
                role,
              }))
            }
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

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel} disabled={isCreating}>
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
