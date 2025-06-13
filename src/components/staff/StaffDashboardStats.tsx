
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

const StaffDashboardStats: React.FC = () => {
  const statsCards = [
    {
      title: 'Pending Tasks',
      value: '24',
      description: '+2 from yesterday',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Upcoming Deadlines',
      value: '8',
      description: 'Next 7 days',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Filed Returns This Month',
      value: '156',
      description: '+12% from last month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Open Tickets',
      value: '5',
      description: '2 high priority',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="border border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StaffDashboardStats;
