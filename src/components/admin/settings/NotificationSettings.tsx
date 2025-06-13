
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Mail } from 'lucide-react';

interface NotificationSettingsProps {
  localSettings: { [key: string]: any };
  handleLocalChange: (key: string, value: any) => void;
  handleUpdateSetting: (key: string, value: any) => Promise<void>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  localSettings,
  handleLocalChange,
  handleUpdateSetting
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <Label htmlFor="email_notifications_enabled" className="text-sm font-medium">
            Enable Email Notifications
          </Label>
          <Switch
            id="email_notifications_enabled"
            checked={localSettings.email_notifications_enabled || false}
            onCheckedChange={(checked) => {
              handleLocalChange('email_notifications_enabled', checked);
              handleUpdateSetting('email_notifications_enabled', checked);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
