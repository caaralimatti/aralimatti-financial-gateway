
import { useQuery } from '@tanstack/react-query';
import { systemSettingsService } from '@/services/systemSettingsService';

export const usePortalStatus = () => {
  const { data: isPortalActive, isLoading, error } = useQuery({
    queryKey: ['portal-status'],
    queryFn: async () => {
      try {
        console.log('🔥 Fetching portal status from database');
        const setting = await systemSettingsService.getSetting('is_portal_active');
        console.log('🔥 Raw portal setting value:', setting);
        
        // Parse the JSON value and default to true if not found
        let parsedValue = true; // Default to active
        
        if (setting !== null) {
          try {
            parsedValue = typeof setting === 'string' ? JSON.parse(setting) : setting;
          } catch (parseError) {
            console.error('🔥 Error parsing portal status:', parseError);
            // If parsing fails, treat as boolean directly
            parsedValue = Boolean(setting);
          }
        }
        
        console.log('🔥 Parsed portal status:', parsedValue);
        return parsedValue;
      } catch (error) {
        console.error('🔥 Error fetching portal status:', error);
        return true; // Default to active if there's an error
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 1, // Only retry once on failure
  });

  console.log('🔥 usePortalStatus hook state:', { 
    isPortalActive, 
    isLoading, 
    error: error?.message 
  });

  return {
    isPortalActive: isPortalActive ?? true, // Default to true
    isLoading: isLoading || false,
    error
  };
};
