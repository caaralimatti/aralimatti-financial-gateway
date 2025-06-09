
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordField from '@/components/admin/tabs/login/PasswordField';

interface BasicDetailsFormProps {
  formData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  showPassword: boolean;
  showConfirmPassword: boolean;
  onFormDataChange: (data: Partial<BasicDetailsFormProps['formData']>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
}

const BasicDetailsForm = ({
  formData,
  showPassword,
  showConfirmPassword,
  onFormDataChange,
  onTogglePassword,
  onToggleConfirmPassword,
}: BasicDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={(e) => onFormDataChange({ fullName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => onFormDataChange({ email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordField
          label="Password *"
          placeholder="Enter password"
          value={formData.password}
          onChange={(value) => onFormDataChange({ password: value })}
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
        />

        <PasswordField
          label="Confirm Password *"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={(value) => onFormDataChange({ confirmPassword: value })}
          showPassword={showConfirmPassword}
          onTogglePassword={onToggleConfirmPassword}
        />
      </div>
    </div>
  );
};

export default BasicDetailsForm;
