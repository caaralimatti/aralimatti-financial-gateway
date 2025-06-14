
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TimeTracking: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Tracking</CardTitle>
        <CardDescription>
          Track time entries for billable tasks and services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Time tracking functionality will be implemented in the task management integration.
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTracking;
