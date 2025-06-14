
import { UserRole } from '@/components/admin/forms/RoleAssignmentForm';

export interface UserFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  phone: string;
  address: string;
  status: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateUserForm = (formData: UserFormData, userRole?: string): ValidationResult => {
  // Basic validation
  if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
    return {
      isValid: false,
      message: "Please fill in all required fields"
    };
  }

  if (formData.password !== formData.confirmPassword) {
    return {
      isValid: false,
      message: "Passwords do not match"
    };
  }

  if (formData.password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long"
    };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return {
      isValid: false,
      message: "Please enter a valid email address"
    };
  }

  // Super admin role validation - only super admins can create other super admins
  if (formData.role === 'super_admin' && userRole !== 'super_admin') {
    return {
      isValid: false,
      message: "Only super admins can create super admin accounts"
    };
  }

  return { isValid: true };
};

export const getInitialFormData = (): UserFormData => ({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'client',
  phone: '',
  address: '',
  status: true,
});
