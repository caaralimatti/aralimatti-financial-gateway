
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const StaffRecentMessages: React.FC = () => {
  const recentMessages = [
    {
      id: 1,
      client: 'ABC Pvt Ltd',
      message: 'GST return filing query',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      client: 'XYZ Corp',
      message: 'Tax audit documentation required',
      time: '4 hours ago',
      priority: 'medium'
    },
    {
      id: 3,
      client: 'DEF Industries',
      message: 'Annual compliance checklist',
      time: '1 day ago',
      priority: 'low'
    }
  ];

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Messages
        </CardTitle>
        <CardDescription>
          Latest client communications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentMessages.map((message) => (
          <div key={message.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 dark:text-white">{message.client}</p>
                <Badge 
                  variant={message.priority === 'high' ? 'destructive' : message.priority === 'medium' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {message.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{message.message}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{message.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default StaffRecentMessages;
