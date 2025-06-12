
import React from 'react';
import { Settings } from 'lucide-react';
import { useSystemSettingsLogic } from '@/hooks/useSystemSettingsLogic';
import PortalStatusSettings from '@/components/admin/settings/PortalStatusSettings';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import SecuritySettings from '@/components/admin/settings/SecuritySettings';
import NotificationSettings from '@/components/admin/settings/NotificationSettings';
import TaskManagementSettings from '@/components/admin/settings/TaskManagementSettings';

const SystemSettings = () => {
  const {
    localSettings,
    handleLocalChange,
    handleUpdateSetting,
    isLoading
  } = useSystemSettingsLogic();

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

      <PortalStatusSettings
        localSettings={localSettings}
        handleLocalChange={handleLocalChange}
        handleUpdateSetting={handleUpdateSetting}
      />

      <GeneralSettings
        localSettings={localSettings}
        handleLocalChange={handleLocalChange}
        handleUpdateSetting={handleUpdateSetting}
      />

      <SecuritySettings
        localSettings={localSettings}
        handleLocalChange={handleLocalChange}
        handleUpdateSetting={handleUpdateSetting}
      />

      <NotificationSettings
        localSettings={localSettings}
        handleLocalChange={handleLocalChange}
        handleUpdateSetting={handleUpdateSetting}
      />

      <TaskManagementSettings
        localSettings={localSettings}
        handleLocalChange={handleLocalChange}
        handleUpdateSetting={handleUpdateSetting}
      />
    </div>
  );
};

export default SystemSettings;
