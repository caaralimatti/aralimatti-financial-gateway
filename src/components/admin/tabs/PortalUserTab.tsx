
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { ClientFormData } from '@/types/clientForm';

interface PortalUserTabProps {
  clientForm: ClientFormData;
  setClientForm: (form: ClientFormData) => void;
}

const PortalUserTab = ({ clientForm, setClientForm }: PortalUserTabProps) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  const handleCreatePortalUserChange = (checked: boolean) => {
    const newPortalUser = {
      ...clientForm.portalUser,
      createPortalUser: checked
    };

    if (checked) {
      // Auto-populate email from primary contact if available
      const primaryContact = clientForm.contactPersons.find((contact: any) => contact.is_primary);
      const email = primaryContact?.email || '';
      const fullName = primaryContact?.name || clientForm.basicDetails.name;
      const generatedPassword = generatePassword();

      newPortalUser.email = email;
      newPortalUser.fullName = fullName;
      newPortalUser.generatedPassword = generatedPassword;
    }

    setClientForm({
      ...clientForm,
      portalUser: newPortalUser
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Password has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy password to clipboard",
        variant: "destructive",
      });
    }
  };

  const regeneratePassword = () => {
    const newPassword = generatePassword();
    setClientForm({
      ...clientForm,
      portalUser: {
        ...clientForm.portalUser,
        generatedPassword: newPassword
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Client Portal User Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="createPortalUser"
              checked={clientForm.portalUser.createPortalUser}
              onCheckedChange={handleCreatePortalUserChange}
            />
            <Label htmlFor="createPortalUser" className="text-sm font-medium">
              Create Client Portal User
            </Label>
          </div>

          {clientForm.portalUser.createPortalUser && (
            <div className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
              <Alert>
                <AlertDescription>
                  A new user account will be created for this client to access the client portal. 
                  The login credentials will be generated automatically. The client will need to log in 
                  separately using these credentials.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portalEmail">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="portalEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={clientForm.portalUser.email}
                    onChange={(e) => setClientForm({
                      ...clientForm,
                      portalUser: { ...clientForm.portalUser, email: e.target.value }
                    })}
                  />
                  <p className="text-xs text-gray-500">
                    This will be the login email for the client portal
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portalFullName">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="portalFullName"
                    placeholder="Client Full Name"
                    value={clientForm.portalUser.fullName}
                    onChange={(e) => setClientForm({
                      ...clientForm,
                      portalUser: { ...clientForm.portalUser, fullName: e.target.value }
                    })}
                  />
                </div>
              </div>

              {clientForm.portalUser.generatedPassword && (
                <div className="space-y-2">
                  <Label>Generated Password</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={clientForm.portalUser.generatedPassword}
                        readOnly
                        className="pr-20 bg-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-12 top-0 h-full px-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2"
                        onClick={() => copyToClipboard(clientForm.portalUser.generatedPassword)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={regeneratePassword}
                    >
                      Regenerate
                    </Button>
                  </div>
                  <Alert className="mt-2">
                    <AlertDescription className="text-sm">
                      <strong>Important:</strong> Please copy this password and provide it to the client securely. 
                      They should change it upon first login. Your admin session will not be affected by creating this client account.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalUserTab;
