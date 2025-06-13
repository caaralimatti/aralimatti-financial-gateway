
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar } from 'lucide-react';
import { useActiveAnnouncements } from '@/hooks/useAnnouncements';

const StaffAnnouncements = () => {
  const { data: announcements = [], isLoading } = useActiveAnnouncements('staff_portal');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-gray-500">Loading announcements...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeAnnouncements = announcements.filter(announcement => 
    announcement.is_active && 
    (announcement.target_audience === 'all' || announcement.target_audience === 'staff_portal')
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Announcements ({activeAnnouncements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeAnnouncements.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-gray-500">No announcements available</div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAnnouncements.slice(0, 3).map((announcement) => (
              <div
                key={announcement.id}
                className="border-l-4 border-primary pl-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{announcement.title}</h3>
                  <Badge variant={announcement.priority === 'High' ? 'destructive' : 'secondary'}>
                    {announcement.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {new Date(announcement.published_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StaffAnnouncements;
