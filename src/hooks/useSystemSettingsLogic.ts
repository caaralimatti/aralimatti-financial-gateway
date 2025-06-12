
import React, { useState } from 'react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useAdminActivity } from '@/hooks/useAdminActivity';

export const useSystemSettingsLogic = () => {
  const { settings, isLoading, updateSetting, isUpdating, getSettingValue } = useSystemSettings();
  const { logActivity } = useAdminActivity();
  const [localSettings, setLocalSettings] = useState<{ [key: string]: any }>({});

  React.useEffect(() => {
    if (settings.length > 0) {
      const settingsMap = settings.reduce((acc, setting) => {
        try {
          // Parse JSON values properly
          acc[setting.key] = typeof setting.value === 'string' 
            ? JSON.parse(setting.value) 
            : setting.value;
        } catch (error) {
          // If parsing fails, use the raw value
          acc[setting.key] = setting.value;
        }
        return acc;
      }, {} as { [key: string]: any });
      
      console.log('🔥 Settings loaded:', settingsMap);
      setLocalSettings(settingsMap);
    }
  }, [settings]);

  const handleUpdateSetting = async (key: string, value: any) => {
    console.log('🔥 Updating setting:', { key, value });
    const oldValue = getSettingValue(key);
    
    try {
      await updateSetting({ key, value });
      
      logActivity({
        activity_type: 'settings_changed',
        description: `Updated setting: ${key}`,
        metadata: { settingKey: key, oldValue, newValue: value }
      });
      
      console.log('🔥 Setting updated successfully');
    } catch (error) {
      console.error('🔥 Error updating setting:', error);
      // Revert local state on error
      setLocalSettings(prev => ({ ...prev, [key]: oldValue }));
    }
  };

  const handleLocalChange = (key: string, value: any) => {
    console.log('🔥 Local setting change:', { key, value });
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    localSettings,
    handleLocalChange,
    handleUpdateSetting,
    isLoading
  };
};
