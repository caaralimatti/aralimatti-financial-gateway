
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, User } from 'lucide-react';
import { useAdminActivity } from '@/hooks/useAdminActivity';

const AdminRecentActivity = () => {
  const { activities = [], isLoading } = useAdminActivity();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Admin Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-gray-500">Loading activities...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatActivityDescription = (description: string) => {
    // Remove user IDs from the description (UUIDs pattern)
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
    
    // Remove verbose status change details and user IDs
    return description
      .replace(uuidPattern, '[User]') // Replace UUIDs with [User]
      .replace(/\(is_active: true -> false\)/g, '')
      .replace(/\(is_active: false -> true\)/g, '')
      .replace(/user:\s*\[User\]/gi, 'user') // Clean up "user: [User]" to just "user"
      .replace(/\s+/g, ' ')
      .trim();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Admin Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-gray-500">No recent activity</div>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                <div className="bg-blue-100 p-2 rounded-full">
                  <User className="h-3 w-3 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {activity.profiles?.full_name || activity.profiles?.email || 'System'}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {activity.activity_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">
                    {formatActivityDescription(activity.description)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRecentActivity;
