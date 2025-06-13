
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface GeneralSettingsProps {
  localSettings: { [key: string]: any };
  handleLocalChange: (key: string, value: any) => void;
  handleUpdateSetting: (key: string, value: any) => Promise<void>;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  localSettings,
  handleLocalChange,
  handleUpdateSetting
}) => {
  return (
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
  );
};

export default GeneralSettings;
