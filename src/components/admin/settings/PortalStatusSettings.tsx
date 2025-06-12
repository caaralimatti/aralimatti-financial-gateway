
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Power } from 'lucide-react';

interface PortalStatusSettingsProps {
  localSettings: { [key: string]: any };
  handleLocalChange: (key: string, value: any) => void;
  handleUpdateSetting: (key: string, value: any) => Promise<void>;
}

const PortalStatusSettings: React.FC<PortalStatusSettingsProps> = ({
  localSettings,
  handleLocalChange,
  handleUpdateSetting
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Power className="h-5 w-5" />
          Portal Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <Label htmlFor="is_portal_active" className="text-sm font-medium">
              Enable Client/Staff Portal
            </Label>
            <p className="text-xs text-gray-500 mt-1">
              When disabled, only admin users can access the portal
            </p>
          </div>
          <Switch
            id="is_portal_active"
            checked={localSettings.is_portal_active || false}
            onCheckedChange={(checked) => {
              handleLocalChange('is_portal_active', checked);
              handleUpdateSetting('is_portal_active', checked);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PortalStatusSettings;
