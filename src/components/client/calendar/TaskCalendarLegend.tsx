
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TaskCalendarLegend: React.FC = () => {
  const priorityItems = [
    { priority: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700' },
    { priority: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700' },
    { priority: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700' }
  ];

  const statusItems = [
    { status: 'completed', label: 'Completed', color: 'bg-green-500' },
    { status: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
    { status: 'pending_approval', label: 'Pending Approval', color: 'bg-yellow-500' },
    { status: 'on_hold', label: 'On Hold', color: 'bg-orange-500' },
    { status: 'to_do', label: 'To Do', color: 'bg-gray-500' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Priority Levels</h4>
          <div className="flex flex-wrap gap-2">
            {priorityItems.map((item) => (
              <div
                key={item.priority}
                className={`px-2 py-1 rounded text-xs border ${item.color}`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Status Indicators</h4>
          <div className="flex flex-wrap gap-3">
            {statusItems.map((item) => (
              <div key={item.status} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCalendarLegend;
