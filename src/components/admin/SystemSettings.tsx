
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Settings, Save, Mail, Shield, User, CheckSquare } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useAdminActivity } from '@/hooks/useAdminActivity';

const SystemSettings = () => {
  const { settings, isLoading, updateSetting, isUpdating, getSettingValue } = useSystemSettings();
  const { logActivity } = useAdminActivity();
  const [localSettings, setLocalSettings] = useState<{ [key: string]: any }>({});

  React.useEffect(() => {
    if (settings.length > 0) {
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as { [key: string]: any });
      setLocalSettings(settingsMap);
    }
  }, [settings]);

  const handleUpdateSetting = async (key: string, value: any) => {
    await updateSetting({ key, value });
    logActivity({
      activity_type: 'settings_changed',
      description: `Updated setting: ${key}`,
      metadata: { key, value }
    });
  };

  const handleLocalChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Name</Label>
              <Input
                id="site_name"
                value={localSettings.site_name || ''}
                onChange={(e) => handleLocalChange('site_name', e.target.value)}
                onBlur={() => handleUpdateSetting('site_name', localSettings.site_name)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={localSettings.contact_email || ''}
                onChange={(e) => handleLocalChange('contact_email', e.target.value)}
                onBlur={() => handleUpdateSetting('contact_email', localSettings.contact_email)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User & Security Settings */}
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

      {/* Notification Settings */}
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

      {/* Task Management Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Task Management Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default_task_priority">Default Task Priority</Label>
            <Select
              value={localSettings.default_task_priority || 'medium'}
              onValueChange={(value) => {
                handleLocalChange('default_task_priority', value);
                handleUpdateSetting('default_task_priority', value);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
