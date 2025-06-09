
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContactInformationFormProps {
  formData: {
    phone: string;
    address: string;
  };
  onFormDataChange: (data: Partial<ContactInformationFormProps['formData']>) => void;
}

const ContactInformationForm = ({ formData, onFormDataChange }: ContactInformationFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => onFormDataChange({ phone: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={(e) => onFormDataChange({ address: e.target.value })}
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInformationForm;
