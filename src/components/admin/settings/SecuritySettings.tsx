
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield } from 'lucide-react';

interface SecuritySettingsProps {
  localSettings: { [key: string]: any };
  handleLocalChange: (key: string, value: any) => void;
  handleUpdateSetting: (key: string, value: any) => Promise<void>;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  localSettings,
  handleLocalChange,
  handleUpdateSetting
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User & Security Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new_user_default_role">New User Default Role</Label>
            <Select
              value={localSettings.new_user_default_role || 'client'}
              onValueChange={(value) => {
                handleLocalChange('new_user_default_role', value);
                handleUpdateSetting('new_user_default_role', value);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_min_length">Minimum Password Length</Label>
            <Input
              id="password_min_length"
              type="number"
              min="6"
              max="20"
              value={localSettings.password_min_length || 8}
              onChange={(e) => handleLocalChange('password_min_length', parseInt(e.target.value))}
              onBlur={() => handleUpdateSetting('password_min_length', localSettings.password_min_length)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="session_timeout_hours">Session Timeout (Hours)</Label>
            <Input
              id="session_timeout_hours"
              type="number"
              min="1"
              max="168"
              value={localSettings.session_timeout_hours || 24}
              onChange={(e) => handleLocalChange('session_timeout_hours', parseInt(e.target.value))}
              onBlur={() => handleUpdateSetting('session_timeout_hours', localSettings.session_timeout_hours)}
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="user_registration_enabled" className="text-sm font-medium">
              Enable User Registration
            </Label>
            <Switch
              id="user_registration_enabled"
              checked={localSettings.user_registration_enabled || false}
              onCheckedChange={(checked) => {
                handleLocalChange('user_registration_enabled', checked);
                handleUpdateSetting('user_registration_enabled', checked);
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
