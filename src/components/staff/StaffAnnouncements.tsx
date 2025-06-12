
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useActiveAnnouncements } from '@/hooks/useAnnouncements';
import { format } from 'date-fns';
import { Bell, AlertCircle } from 'lucide-react';

const StaffAnnouncements: React.FC = () => {
  const { data: announcements = [], isLoading, error } = useActiveAnnouncements('staff_portal');

  if (isLoading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Firm Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Firm Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">Failed to load announcements</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Firm Announcements
        </CardTitle>
        <CardDescription>
          Latest updates and notices from the firm
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No announcements at this time</p>
          </div>
        ) : (
          announcements.slice(0, 3).map((announcement) => (
            <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h3>
                <Badge 
                  variant={announcement.priority === 'High' ? 'destructive' : announcement.priority === 'Normal' ? 'default' : 'secondary'}
                  className="text-xs ml-2"
                >
                  {announcement.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{announcement.content}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Published: {format(new Date(announcement.published_at), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default StaffAnnouncements;
