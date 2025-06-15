
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Eye, EyeOff, Clock, User, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TempPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tempPasswordData: {
    tempPassword: string;
    clientEmail: string;
    clientName: string;
    expiresAt: string;
  } | null;
}

const TempPasswordModal = ({ open, onOpenChange, tempPasswordData }: TempPasswordModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Temporary password has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy password to clipboard",
        variant: "destructive",
      });
    }
  };

  const formatExpiryDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!tempPasswordData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Temporary Password Generated
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              <strong>Important:</strong> This password will only be shown once. Please copy it and provide it to the client securely.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Client
              </Label>
              <Input
                value={`${tempPasswordData.clientName} (${tempPasswordData.clientEmail})`}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Temporary Password</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={tempPasswordData.tempPassword}
                    readOnly
                    className="pr-20 bg-white font-mono"
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
                    onClick={() => copyToClipboard(tempPasswordData.tempPassword)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Expires At
              </Label>
              <Input
                value={formatExpiryDate(tempPasswordData.expiresAt)}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Next Steps:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Provide this password to the client securely (not via email)</li>
                <li>Client must change this password on first login</li>
                <li>Password expires in 24 hours</li>
                <li>This is a one-time display - copy the password now</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => copyToClipboard(tempPasswordData.tempPassword)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Password
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TempPasswordModal;
