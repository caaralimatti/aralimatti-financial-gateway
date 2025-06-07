
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PasswordField from './PasswordField';

interface OtherLoginSectionProps {
  clientForm: any;
  setClientForm: (form: any) => void;
  showMcaV2Password: boolean;
  showMcaV3Password: boolean;
  showDgftPassword: boolean;
  onToggleMcaV2Password: () => void;
  onToggleMcaV3Password: () => void;
  onToggleDgftPassword: () => void;
}

const OtherLoginSection = ({ 
  clientForm, 
  setClientForm, 
  showMcaV2Password,
  showMcaV3Password,
  showDgftPassword,
  onToggleMcaV2Password,
  onToggleMcaV3Password,
  onToggleDgftPassword
}: OtherLoginSectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Other Login Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>MCA V2 Username</Label>
          <Input 
            placeholder="MCA V2 Username"
            value={clientForm.loginDetails.mcaV2Username}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, mcaV2Username: e.target.value }
            }))}
          />
        </div>
        <PasswordField
          label="MCA V2 Password"
          placeholder="MCA V2 Password"
          value={clientForm.loginDetails.mcaV2Password}
          onChange={(value) => setClientForm(prev => ({
            ...prev,
            loginDetails: { ...prev.loginDetails, mcaV2Password: value }
          }))}
          showPassword={showMcaV2Password}
          onTogglePassword={onToggleMcaV2Password}
        />
        <div className="space-y-2">
          <Label>MCA V3 Username</Label>
          <Input 
            placeholder="MCA V3 Username"
            value={clientForm.loginDetails.mcaV3Username}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, mcaV3Username: e.target.value }
            }))}
          />
        </div>
        <PasswordField
          label="MCA V3 Password"
          placeholder="MCA V3 Password"
          value={clientForm.loginDetails.mcaV3Password}
          onChange={(value) => setClientForm(prev => ({
            ...prev,
            loginDetails: { ...prev.loginDetails, mcaV3Password: value }
          }))}
          showPassword={showMcaV3Password}
          onTogglePassword={onToggleMcaV3Password}
        />
        <div className="space-y-2">
          <Label>DGFT Username</Label>
          <Input 
            placeholder="DGFT Username"
            value={clientForm.loginDetails.dgftUsername}
            onChange={(e) => setClientForm(prev => ({
              ...prev,
              loginDetails: { ...prev.loginDetails, dgftUsername: e.target.value }
            }))}
          />
        </div>
        <PasswordField
          label="DGFT Password"
          placeholder="DGFT Password"
          value={clientForm.loginDetails.dgftPassword}
          onChange={(value) => setClientForm(prev => ({
            ...prev,
            loginDetails: { ...prev.loginDetails, dgftPassword: value }
          }))}
          showPassword={showDgftPassword}
          onTogglePassword={onToggleDgftPassword}
        />
      </div>
    </div>
  );
};

export default OtherLoginSection;
