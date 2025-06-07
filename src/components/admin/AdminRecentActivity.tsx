
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Database, UserPlus, Shield } from 'lucide-react';

const AdminRecentActivity = () => {
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
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Database className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">System maintenance completed</p>
                <p className="text-sm text-gray-600">Database optimization performed</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <UserPlus className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">New staff member added</p>
                <p className="text-sm text-gray-600">Staff access granted</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">6 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Security audit completed</p>
                <p className="text-sm text-gray-600">All systems secure</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">1 day ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRecentActivity;
