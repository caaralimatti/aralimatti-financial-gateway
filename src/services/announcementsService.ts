
import { supabase } from '@/integrations/supabase/client';
import { Announcement, CreateAnnouncementData, UpdateAnnouncementData } from '@/types/announcements';

export const announcementsService = {
  async fetchAnnouncements(): Promise<Announcement[]> {
    console.log('🔥 Fetching all announcements for admin');
    
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('🔥 Error fetching announcements:', error);
      throw error;
    }

    console.log('🔥 Fetched announcements:', data);
    return (data || []).map(item => ({
      ...item,
      target_audience: item.target_audience as 'all' | 'staff_portal' | 'client_portal',
      priority: item.priority as 'High' | 'Normal' | 'Low'
    }));
  },

  async fetchActiveAnnouncements(targetAudience?: 'staff_portal' | 'client_portal'): Promise<Announcement[]> {
    console.log('🔥 Fetching active announcements for audience:', targetAudience);
    
    let query = supabase
      .from('announcements')
      .select('*')
      .eq('is_active', true)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });

    // Filter by target audience
    if (targetAudience) {
      query = query.in('target_audience', ['all', targetAudience]);
    }

    // Filter out expired announcements
    query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    const { data, error } = await query;

    if (error) {
      console.error('🔥 Error fetching active announcements:', error);
      throw error;
    }

    console.log('🔥 Fetched active announcements:', data);
    return (data || []).map(item => ({
      ...item,
      target_audience: item.target_audience as 'all' | 'staff_portal' | 'client_portal',
      priority: item.priority as 'High' | 'Normal' | 'Low'
    }));
  },

  async createAnnouncement(announcementData: CreateAnnouncementData): Promise<Announcement> {
    console.log('🔥 Creating announcement:', announcementData);
    
    const { data, error } = await supabase
      .from('announcements')
      .insert(announcementData)
      .select()
      .single();

    if (error) {
      console.error('🔥 Error creating announcement:', error);
      throw error;
    }

    console.log('🔥 Created announcement:', data);
    return {
      ...data,
      target_audience: data.target_audience as 'all' | 'staff_portal' | 'client_portal',
      priority: data.priority as 'High' | 'Normal' | 'Low'
    };
  },

  async updateAnnouncement(announcementData: UpdateAnnouncementData): Promise<Announcement> {
    console.log('🔥 Updating announcement:', announcementData);
    
    const { id, ...updateData } = announcementData;
    
    const { data, error } = await supabase
      .from('announcements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('🔥 Error updating announcement:', error);
      throw error;
    }

    console.log('🔥 Updated announcement:', data);
    return {
      ...data,
      target_audience: data.target_audience as 'all' | 'staff_portal' | 'client_portal',
      priority: data.priority as 'High' | 'Normal' | 'Low'
    };
  },

  async deleteAnnouncement(id: string): Promise<void> {
    console.log('🔥 Deleting announcement:', id);
    
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('🔥 Error deleting announcement:', error);
      throw error;
    }

    console.log('🔥 Deleted announcement:', id);
  }
};
