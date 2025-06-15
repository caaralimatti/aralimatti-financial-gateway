import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff, User, AlertTriangle, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePortalUserDetails } from '@/hooks/usePortalUserDetails';
import type { ClientFormData } from '@/types/clientForm';

interface PortalUserTabProps {
  clientForm: ClientFormData;
  setClientForm: (form: ClientFormData) => void;
  clientId?: string;
}

const PortalUserTab = ({ clientForm, setClientForm, clientId }: PortalUserTabProps) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  
  // Get existing portal user details if client has one
  const existingPortalUserId = clientForm.basicDetails?.name ? 
    // We need to get this from the client data when editing
    (clientForm as any)?.existingPortalUserId || null : null;
  
  const { data: existingPortalUser, isLoading: isLoadingPortalUser } = usePortalUserDetails(existingPortalUserId);

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailCheckStatus('idle');
      return;
    }

    setEmailCheckStatus('checking');
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .limit(1);

      if (error) {
        console.error('🔥 Error checking email:', error);
        setEmailCheckStatus('idle');
        return;
      }

      if (data && data.length > 0) {
        setEmailCheckStatus('taken');
      } else {
        setEmailCheckStatus('available');
      }
    } catch (error) {
      console.error('🔥 Error in email check:', error);
      setEmailCheckStatus('idle');
    }
  };

  // Debounced email check
  useEffect(() => {
    if (!clientForm.portalUser.createPortalUser || !clientForm.portalUser.email) {
      setEmailCheckStatus('idle');
      return;
    }

    const timeoutId = setTimeout(() => {
      checkEmailAvailability(clientForm.portalUser.email);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [clientForm.portalUser.email, clientForm.portalUser.createPortalUser]);

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
    } else {
      // Clear email check status when disabling
      setEmailCheckStatus('idle');
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
        description: "Text has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
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

  const handleEmailChange = (email: string) => {
    setClientForm({
      ...clientForm,
      portalUser: { ...clientForm.portalUser, email }
    });
  };

  const unlinkPortalUser = () => {
    // This would need to be implemented to remove the portal user link
    toast({
      title: "Feature Coming Soon",
      description: "Portal user unlinking will be available in the next update",
    });
  };

  return (
    <div className="space-y-6">
      {/* Existing Portal User Display */}
      {existingPortalUser && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <UserCheck className="h-5 w-5" />
              Existing Portal User Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                This client already has a portal user account linked to their profile.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-green-700">Portal User Email</Label>
                <div className="flex gap-2">
                  <Input 
                    value={existingPortalUser.email}
                    readOnly
                    className="bg-white border-green-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(existingPortalUser.email)}
                    className="border-green-200"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-green-700">Full Name</Label>
                <Input 
                  value={existingPortalUser.full_name || 'Not set'}
                  readOnly
                  className="bg-white border-green-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-green-700">Account Status</Label>
                <div className="flex items-center gap-2">
                  {existingPortalUser.is_active ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={existingPortalUser.is_active ? 'text-green-600' : 'text-red-600'}>
                    {existingPortalUser.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-green-700">Last Login</Label>
                <Input 
                  value={existingPortalUser.last_login_at ? 
                    new Date(existingPortalUser.last_login_at).toLocaleDateString() : 
                    'Never logged in'
                  }
                  readOnly
                  className="bg-white border-green-200"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={unlinkPortalUser}
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                Unlink Portal User
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Portal User Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {existingPortalUser ? 'Create New Portal User Account' : 'Client Portal User Account'}
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
              {existingPortalUser ? 'Create Additional Portal User' : 'Create Client Portal User'}
            </Label>
          </div>

          {clientForm.portalUser.createPortalUser && (
            <div className="space-y-4 mt-4 p-4 border rounded-lg bg-gray-50">
              <Alert>
                <AlertDescription>
                  {existingPortalUser ? 
                    'This will create an additional portal user account for this client. The client will have multiple login options.' :
                    'A new user account will be created for this client to access the client portal. The login credentials will be generated automatically.'
                  }
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portalEmail">Email Address <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input
                      id="portalEmail"
                      type="email"
                      placeholder="client@example.com"
                      value={clientForm.portalUser.email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className={
                        emailCheckStatus === 'taken' ? 'border-red-500' : 
                        emailCheckStatus === 'available' ? 'border-green-500' : ''
                      }
                    />
                    {emailCheckStatus === 'checking' && (
                      <div className="absolute right-3 top-2.5">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                      </div>
                    )}
                  </div>
                  
                  {emailCheckStatus === 'taken' && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      This email is already registered. Please use a different email.
                    </div>
                  )}
                  
                  {emailCheckStatus === 'available' && (
                    <div className="text-green-600 text-sm">
                      ✓ Email is available
                    </div>
                  )}
                  
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

              {emailCheckStatus === 'taken' && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Cannot create portal user: The email address is already in use by another user. 
                    Please choose a different email address.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalUserTab;
