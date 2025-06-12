
import { useQuery } from '@tanstack/react-query';
import { systemSettingsService } from '@/services/systemSettingsService';

export const usePortalStatus = () => {
  const { data: isPortalActive, isLoading, error } = useQuery({
    queryKey: ['portal-status'],
    queryFn: async () => {
      try {
        const setting = await systemSettingsService.getSetting('is_portal_active');
        // Parse the JSON value and default to true if not found
        return setting ? JSON.parse(setting) : true;
      } catch (error) {
        console.error('Error fetching portal status:', error);
        return true; // Default to active if there's an error
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1, // Only retry once on failure
  });

  return {
    isPortalActive: isPortalActive ?? true, // Default to true
    isLoading: isLoading || false,
    error
  };
};
