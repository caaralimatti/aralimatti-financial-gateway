
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordField from './PasswordField';

interface TracesLoginSectionProps {
  clientForm: any;
  setClientForm: (form: any) => void;
  showTracesDeductorPassword: boolean;
  showTracesTaxpayerPassword: boolean;
  onToggleTracesDeductorPassword: () => void;
  onToggleTracesTaxpayerPassword: () => void;
}

const TracesLoginSection = ({ 
  clientForm, 
  setClientForm, 
  showTracesDeductorPassword,
  showTracesTaxpayerPassword,
  onToggleTracesDeductorPassword,
  onToggleTracesTaxpayerPassword
}: TracesLoginSectionProps) => {
  if (!clientForm.taxesApplicable.tdsTcs) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Traces Login Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Traces Username</Label>
          <Input 
            placeholder="Traces Username"
            value={clientForm.loginDetails.tracesUsername}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, tracesUsername: e.target.value }
            }))}
          />
        </div>
        <PasswordField
          label="Traces Deductor Password"
          placeholder="Traces Deductor Password"
          value={clientForm.loginDetails.tracesDeductorPassword}
          onChange={(value) => setClientForm(prev => ({
            ...prev,
            loginDetails: { ...prev.loginDetails, tracesDeductorPassword: value }
          }))}
          showPassword={showTracesDeductorPassword}
          onTogglePassword={onToggleTracesDeductorPassword}
        />
        <div className="md:col-start-2">
          <PasswordField
            label="Traces Taxpayer Password"
            placeholder="Traces Taxpayer Password"
            value={clientForm.loginDetails.tracesTaxpayerPassword}
            onChange={(value) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, tracesTaxpayerPassword: value }
            }))}
            showPassword={showTracesTaxpayerPassword}
            onTogglePassword={onToggleTracesTaxpayerPassword}
          />
        </div>
      </div>
    </div>
  );
};

export default TracesLoginSection;
