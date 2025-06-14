
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordField from './PasswordField';

interface ITLoginSectionProps {
  clientForm: any;
  setClientForm: (form: any) => void;
  showItPassword: boolean;
  showItDeductorPassword: boolean;
  onToggleItPassword: () => void;
  onToggleItDeductorPassword: () => void;
}

const ITLoginSection = ({ 
  clientForm, 
  setClientForm, 
  showItPassword,
  showItDeductorPassword,
  onToggleItPassword,
  onToggleItDeductorPassword
}: ITLoginSectionProps) => {
  if (!clientForm.taxesApplicable.incomeTax) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">IT Login Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>PAN</Label>
          <Input 
            placeholder="PAN"
            value={clientForm.loginDetails.itPan}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, itPan: e.target.value }
            }))}
          />
        </div>
        <PasswordField
          label="IT Portal Password"
          placeholder="IT Portal Password"
          value={clientForm.loginDetails.itPassword}
          onChange={(value) => setClientForm(prev => ({
            ...prev,
            loginDetails: { ...prev.loginDetails, itPassword: value }
          }))}
          showPassword={showItPassword}
          onTogglePassword={onToggleItPassword}
        />
        <div className="space-y-2">
          <Label>TAN</Label>
          <Input 
            placeholder="TAN"
            value={clientForm.loginDetails.itTan}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, itTan: e.target.value }
            }))}
          />
        </div>
        <PasswordField
          label="IT Portal Deductor Password"
          placeholder="IT Portal Deductor Password"
          value={clientForm.loginDetails.itDeductorPassword}
          onChange={(value) => setClientForm(prev => ({
            ...prev,
            loginDetails: { ...prev.loginDetails, itDeductorPassword: value }
          }))}
          showPassword={showItDeductorPassword}
          onTogglePassword={onToggleItDeductorPassword}
        />
      </div>
    </div>
  );
};

export default ITLoginSection;
