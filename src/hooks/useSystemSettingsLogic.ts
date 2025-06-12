
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
        acc[setting.key] = setting.value;
        return acc;
      }, {} as { [key: string]: any });
      setLocalSettings(settingsMap);
    }
  }, [settings]);

  const handleUpdateSetting = async (key: string, value: any) => {
    const oldValue = getSettingValue(key);
    await updateSetting({ key, value });
    logActivity({
      activity_type: 'settings_changed',
      description: `Updated setting: ${key}`,
      metadata: { settingKey: key, oldValue, newValue: value }
    });
  };

  const handleLocalChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    localSettings,
    handleLocalChange,
    handleUpdateSetting,
    isLoading
  };
};
