
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsService } from '@/services/announcementsService';
import { CreateAnnouncementData, UpdateAnnouncementData } from '@/types/announcements';
import { toast } from 'sonner';

export const useAnnouncements = () => {
  const queryClient = useQueryClient();

  const {
    data: announcements = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementsService.fetchAnnouncements,
  });

  const createMutation = useMutation({
    mutationFn: announcementsService.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['active-announcements'] });
      toast.success('Announcement created successfully');
    },
    onError: (error) => {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    },
  });

  const updateMutation = useMutation({
    mutationFn: announcementsService.updateAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['active-announcements'] });
      toast.success('Announcement updated successfully');
    },
    onError: (error) => {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: announcementsService.deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.invalidateQueries({ queryKey: ['active-announcements'] });
      toast.success('Announcement deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    },
  });

  return {
    announcements,
    isLoading,
    error,
    createAnnouncement: createMutation.mutate,
    updateAnnouncement: updateMutation.mutate,
    deleteAnnouncement: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useActiveAnnouncements = (targetAudience?: 'staff_portal' | 'client_portal') => {
  return useQuery({
    queryKey: ['active-announcements', targetAudience],
    queryFn: () => announcementsService.fetchActiveAnnouncements(targetAudience),
  });
};
