
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react';

const TasksDashboard = () => {
  const dashboardStats = [
    {
      title: 'Total Tasks',
      value: '247',
      change: '+12 from last week',
      icon: CheckSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Overdue Tasks',
      value: '8',
      change: '-3 from yesterday',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Pending Approvals',
      value: '15',
      change: '+5 today',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Upcoming Deadlines',
      value: '23',
      change: 'Next 7 days',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Billable Hours',
      value: '142.5',
      change: 'This month',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Completion Rate',
      value: '94%',
      change: '+2% this week',
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {dashboardStats.map((stat, index) => (
        <Card key={index} className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TasksDashboard;
