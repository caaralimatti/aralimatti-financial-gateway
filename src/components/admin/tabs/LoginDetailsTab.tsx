import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { usePasswordVisibility } from '@/hooks/usePasswordVisibility';

interface LoginDetailsTabProps {
  clientForm: any;
  setClientForm: (form: any) => void;
}

const LoginDetailsTab = ({ clientForm, setClientForm }: LoginDetailsTabProps) => {
  const { showPassword, togglePassword } = usePasswordVisibility();

  return (
    <div className="space-y-6">
      {/* GST Login Details - Only show when GST is applicable */}
      {clientForm.taxesApplicable.gst && (
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
            <div className="space-y-2">
              <Label>GST Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword.gstPassword ? "text" : "password"}
                  placeholder="GST Password"
                  value={clientForm.loginDetails.gstPassword}
                  onChange={(e) => setClientForm(prev => ({
                    ...prev,
                    loginDetails: { ...prev.loginDetails, gstPassword: e.target.value }
                  }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => togglePassword('gstPassword')}
                >
                  {showPassword.gstPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
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
      )}

      {/* IT Login Details */}
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
          <div className="space-y-2">
            <Label>IT Portal Password</Label>
            <div className="relative">
              <Input 
                type={showPassword.itPassword ? "text" : "password"}
                placeholder="IT Portal Password"
                value={clientForm.loginDetails.itPassword}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, itPassword: e.target.value }
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePassword('itPassword')}
              >
                {showPassword.itPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
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
          <div className="space-y-2">
            <Label>IT Portal Deductor Password</Label>
            <div className="relative">
              <Input 
                type={showPassword.itDeductorPassword ? "text" : "password"}
                placeholder="IT Portal Deductor Password"
                value={clientForm.loginDetails.itDeductorPassword}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, itDeductorPassword: e.target.value }
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePassword('itDeductorPassword')}
              >
                {showPassword.itDeductorPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Traces Login Details */}
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
          <div className="space-y-2">
            <Label>Traces Deductor Password</Label>
            <div className="relative">
              <Input 
                type={showPassword.tracesDeductorPassword ? "text" : "password"}
                placeholder="Traces Deductor Password"
                value={clientForm.loginDetails.tracesDeductorPassword}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, tracesDeductorPassword: e.target.value }
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePassword('tracesDeductorPassword')}
              >
                {showPassword.tracesDeductorPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Traces Taxpayer Password</Label>
            <div className="relative">
              <Input 
                type={showPassword.tracesTaxpayerPassword ? "text" : "password"}
                placeholder="Traces Taxpayer Password"
                value={clientForm.loginDetails.tracesTaxpayerPassword}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, tracesTaxpayerPassword: e.target.value }
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePassword('tracesTaxpayerPassword')}
              >
                {showPassword.tracesTaxpayerPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Login Details */}
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
          <div className="space-y-2">
            <Label>MCA V2 Password</Label>
            <div className="relative">
              <Input 
                type={showPassword.mcaV2Password ? "text" : "password"}
                placeholder="MCA V2 Password"
                value={clientForm.loginDetails.mcaV2Password}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, mcaV2Password: e.target.value }
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePassword('mcaV2Password')}
              >
                {showPassword.mcaV2Password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
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
          <div className="space-y-2">
            <Label>MCA V3 Password</Label>
            <div className="relative">
              <Input 
                type={showPassword.mcaV3Password ? "text" : "password"}
                placeholder="MCA V3 Password"
                value={clientForm.loginDetails.mcaV3Password}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, mcaV3Password: e.target.value }
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePassword('mcaV3Password')}
              >
                {showPassword.mcaV3Password ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
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
          <div className="space-y-2">
            <Label>DGFT Password</Label>
            <div className="relative">
              <Input 
                type={showPassword.dgftPassword ? "text" : "password"}
                placeholder="DGFT Password"
                value={clientForm.loginDetails.dgftPassword}
                onChange={(e) => setClientForm(prev => ({
                  ...prev,
                  loginDetails: { ...prev.loginDetails, dgftPassword: e.target.value }
                }))}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePassword('dgftPassword')}
              >
                {showPassword.dgftPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDetailsTab;
