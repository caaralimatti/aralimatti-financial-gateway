
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { systemSettingsService, SystemSetting } from '@/services/systemSettingsService';

export const useSystemSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: settings = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['system-settings'],
    queryFn: systemSettingsService.fetchSettings
  });

  const updateSettingMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) =>
      systemSettingsService.updateSetting(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    },
    onError: (error: any) => {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update setting",
        variant: "destructive",
      });
    }
  });

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : null;
  };

  return {
    settings,
    isLoading,
    error,
    updateSetting: updateSettingMutation.mutate,
    isUpdating: updateSettingMutation.isPending,
    getSettingValue
  };
};
