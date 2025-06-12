
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TaskCalendarLegend = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Priority Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Low Priority</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCalendarLegend;
