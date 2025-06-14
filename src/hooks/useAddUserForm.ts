
import { useState } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserFormData, validateUserForm, getInitialFormData } from '@/utils/userFormValidation';

export const useAddUserForm = (onSuccess: () => void) => {
  const { createUser, isCreating } = useUserManagement();
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(getInitialFormData());

  const resetForm = () => {
    setFormData(getInitialFormData());
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleFormDataChange = (newData: Partial<UserFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    const validation = validateUserForm(formData, profile?.role);
    
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.message,
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
      onSuccess();
      
      // Success toast will be shown by the hook
    } catch (error) {
      console.error('Error creating user:', error);
      // Error toast will be shown by the hook
    }
  };

  const handleCancel = () => {
    resetForm();
    onSuccess();
  };

  return {
    formData,
    showPassword,
    showConfirmPassword,
    isCreating,
    setShowPassword,
    setShowConfirmPassword,
    handleFormDataChange,
    handleSave,
    handleCancel,
  };
};
