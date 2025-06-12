
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusToggleFormProps {
  isActive: boolean;
  onIsActiveChange: (checked: boolean) => void;
  enableDscTab?: boolean;
  onEnableDscTabChange?: (checked: boolean) => void;
}

const StatusToggleForm: React.FC<StatusToggleFormProps> = ({ 
  isActive, 
  onIsActiveChange,
  enableDscTab = false,
  onEnableDscTabChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="isActive">Active Status</Label>
            <div className="text-sm text-gray-600">
              When disabled, the user will not be able to access the system
            </div>
          </div>
          <Switch
            id="isActive"
            checked={isActive}
            onCheckedChange={onIsActiveChange}
          />
        </div>

        {onEnableDscTabChange && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableDscTab">Enable DSC Tab</Label>
              <div className="text-sm text-gray-600">
                Show DSC certificates tab in client portal
              </div>
            </div>
            <Switch
              id="enableDscTab"
              checked={enableDscTab}
              onCheckedChange={onEnableDscTabChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusToggleForm;
