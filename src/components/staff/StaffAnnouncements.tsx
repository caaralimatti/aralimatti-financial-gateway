
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StaffAnnouncements: React.FC = () => {
  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
          📢 Firm Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-blue-800 dark:text-blue-200">
            • New GST filing deadline extended to 25th of this month
          </p>
          <p className="text-blue-800 dark:text-blue-200">
            • Staff meeting scheduled for Friday 3 PM - Conference Room A
          </p>
          <p className="text-blue-800 dark:text-blue-200">
            • Updated audit checklist available in Documents section
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffAnnouncements;
