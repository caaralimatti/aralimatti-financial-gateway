
import { supabase } from '@/integrations/supabase/client';
import { Announcement, CreateAnnouncementData, UpdateAnnouncementData } from '@/types/announcements';

export const announcementsService = {
  async fetchAnnouncements(): Promise<Announcement[]> {
    console.log('Fetching announcements...');
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }

    console.log('Fetched announcements:', data);
    return data as Announcement[];
  },

  async fetchActiveAnnouncements(targetAudience?: 'staff_portal' | 'client_portal'): Promise<Announcement[]> {
    console.log('Fetching active announcements for:', targetAudience);
    let query = supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .lte('published_at', new Date().toISOString())
      .order('priority', { ascending: false })
      .order('published_at', { ascending: false });

    if (targetAudience) {
      query = query.in('target_audience', ['all', targetAudience]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching active announcements:', error);
      throw error;
    }

    // Filter out expired announcements
    const now = new Date();
    const activeAnnouncements = data.filter(announcement => 
      !announcement.expires_at || new Date(announcement.expires_at) > now
    );

    console.log('Fetched active announcements:', activeAnnouncements);
    return activeAnnouncements as Announcement[];
  },

  async createAnnouncement(announcementData: CreateAnnouncementData): Promise<Announcement> {
    console.log('Creating announcement:', announcementData);
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcementData)
      .select()
      .single();

    if (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }

    console.log('Announcement created successfully:', data);
    return data as Announcement;
  },

  async updateAnnouncement(updateData: UpdateAnnouncementData): Promise<Announcement> {
    console.log('Updating announcement:', updateData);
    const { id, ...updates } = updateData;
    
    const { data, error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }

    console.log('Announcement updated successfully:', data);
    return data as Announcement;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    console.log('Deleting announcement:', id);
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }

    console.log('Announcement deleted successfully');
  }
};
