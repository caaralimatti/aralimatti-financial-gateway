
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PasswordField from './PasswordField';

interface GSTLoginSectionProps {
  clientForm: any;
  setClientForm: (form: any) => void;
  showGstPassword: boolean;
  onToggleGstPassword: () => void;
}

const GSTLoginSection = ({ 
  clientForm, 
  setClientForm, 
  showGstPassword, 
  onToggleGstPassword 
}: GSTLoginSectionProps) => {
  if (!clientForm.taxesApplicable.gst) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">GST Login Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>GST Number/GSTIN</Label>
          <Input 
            placeholder="GST Number"
            value={clientForm.loginDetails.gstNumber}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, gstNumber: e.target.value }
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label>GST Username</Label>
          <Input 
            placeholder="GST Username"
            value={clientForm.loginDetails.gstUsername}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, gstUsername: e.target.value }
            }))}
          />
        </div>
        <PasswordField
          label="GST Password"
          placeholder="GST Password"
          value={clientForm.loginDetails.gstPassword}
          onChange={(value) => setClientForm(prev => ({
            ...prev,
            loginDetails: { ...prev.loginDetails, gstPassword: value }
          }))}
          showPassword={showGstPassword}
          onTogglePassword={onToggleGstPassword}
        />
        <div className="space-y-2">
          <Label>Registration Type</Label>
          <Select 
            value={clientForm.loginDetails.gstRegistrationType}
            onValueChange={(value) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, gstRegistrationType: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Registration Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Regular">Regular</SelectItem>
              <SelectItem value="Composition">Composition</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Return Frequency</Label>
          <Select 
            value={clientForm.loginDetails.gstReturnFrequency}
            onValueChange={(value) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, gstReturnFrequency: value }
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Return Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default GSTLoginSection;
