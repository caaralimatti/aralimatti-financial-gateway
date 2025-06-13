
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
      case 'logout':
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
      case 'logout':
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
      return `Updated setting: ${settingKey}`;
    }
    
    // Enhanced formatting for user status changes
    if (activity_type === 'user_status_changed' && metadata?.targetUserName) {
      const { targetUserName, changedFields } = metadata;
      
      // Check if it's an activation/deactivation
      if (changedFields?.is_active) {
        const isActivated = changedFields.is_active.new === true;
        return `${isActivated ? 'Activated' : 'Deactivated'} user: ${targetUserName}`;
      }
      
      return `Updated user: ${targetUserName}`;
    }
    
    // Enhanced formatting for other user updates
    if (activity_type === 'user_updated' && metadata?.targetUserName) {
      return `Updated user: ${metadata.targetUserName}`;
    }
    
    // Enhanced formatting for user creation
    if (activity_type === 'user_added' && metadata?.targetUserName) {
      return `Added new user: ${metadata.targetUserName}`;
    }
    
    // For activities with UUIDs in the description, try to clean them up
    if (description.includes('user:') && description.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)) {
      // Extract action from description
      const action = description.split(':')[0];
      
      if (metadata?.targetUserName) {
        return `${action}: ${metadata.targetUserName}`;
      } else {
        // Fallback to generic description if user name not available
        if (action.toLowerCase().includes('activate')) {
          return 'A user was activated';
        } else if (action.toLowerCase().includes('deactivate')) {
          return 'A user was deactivated';
        } else if (action.toLowerCase().includes('update')) {
          return 'A user was updated';
        } else if (action.toLowerCase().includes('add')) {
          return 'A new user was added';
        }
      }
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
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatActivityDescription(activity)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {activity.profiles?.full_name || activity.profiles?.email || 'Unknown User'}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
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
