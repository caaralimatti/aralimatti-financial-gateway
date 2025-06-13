
export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: 'all' | 'staff_portal' | 'client_portal';
  created_at: string;
  published_at: string;
  expires_at?: string;
  is_active: boolean;
  priority: 'High' | 'Normal' | 'Low';
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  target_audience: 'all' | 'staff_portal' | 'client_portal';
  published_at: string;
  expires_at?: string;
  is_active?: boolean;
  priority?: 'High' | 'Normal' | 'Low';
}

export interface UpdateAnnouncementData extends Partial<CreateAnnouncementData> {
  id: string;
}
