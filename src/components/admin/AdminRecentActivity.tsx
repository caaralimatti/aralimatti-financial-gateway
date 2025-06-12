
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, User, Settings, UserPlus, LogIn, Edit } from 'lucide-react';
import { useAdminActivity } from '@/hooks/useAdminActivity';
import { formatDistanceToNow } from 'date-fns';

const AdminRecentActivity = () => {
  const { activities, isLoading, error } = useAdminActivity();

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'login':
        return <LogIn className="h-4 w-4 text-blue-600" />;
      case 'user_added':
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'user_updated':
      case 'user_status_changed':
        return <Edit className="h-4 w-4 text-orange-600" />;
      case 'settings_changed':
        return <Settings className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'login':
        return 'bg-blue-100';
      case 'user_added':
        return 'bg-green-100';
      case 'user_updated':
      case 'user_status_changed':
        return 'bg-orange-100';
      case 'settings_changed':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatActivityDescription = (activity: any) => {
    const { description, metadata, activity_type } = activity;
    
    // Enhanced formatting for settings changes
    if (activity_type === 'settings_changed' && metadata?.settingKey) {
      const { settingKey, oldValue, newValue } = metadata;
      return `Updated setting: ${settingKey} from '${oldValue}' to '${newValue}'`;
    }
    
    // Enhanced formatting for user updates
    if ((activity_type === 'user_updated' || activity_type === 'user_status_changed') && metadata?.changedFields) {
      const { changedFields } = metadata;
      const changes = Object.entries(changedFields).map(([field, values]: [string, any]) => {
        return `${field}: ${values.old} → ${values.new}`;
      }).join(', ');
      return `${description} (${changes})`;
    }
    
    return description;
  };

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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 p-2 rounded-full animate-pulse w-10 h-10"></div>
                  <div className="space-y-1">
                    <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
                    <div className="w-24 h-3 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-3 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Admin Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Unable to load recent activities</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Admin Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activities to display</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.activity_type)}`}>
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatActivityDescription(activity)}
                    </p>
                    <p className="text-sm text-gray-600">
                      by {activity.profiles?.full_name || activity.profiles?.email || 'Unknown User'}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentActivity;
