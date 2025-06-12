
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useActiveAnnouncements } from '@/hooks/useAnnouncements';
import { format } from 'date-fns';

const ClientAnnouncements: React.FC = () => {
  const { data: announcements = [], isLoading, error } = useActiveAnnouncements('client_portal');

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-900 dark:text-green-100">
            📢 Firm Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-green-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-green-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-green-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-red-900 dark:text-red-100">
            📢 Firm Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-800 dark:text-red-200">
            Failed to load updates. Please try refreshing the page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-900 dark:text-green-100">
          📢 Firm Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <p className="text-green-800 dark:text-green-200">
            No updates at this time.
          </p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border-b border-green-200 dark:border-green-700 last:border-b-0 pb-3 last:pb-0">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    {announcement.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {announcement.priority === 'High' && (
                      <Badge variant="destructive" className="text-xs">
                        {announcement.priority}
                      </Badge>
                    )}
                    <span className="text-xs text-green-600 dark:text-green-300">
                      {format(new Date(announcement.published_at), 'MMM dd')}
                    </span>
                  </div>
                </div>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  {announcement.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientAnnouncements;
