
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, FileText, CheckCircle, Calendar, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsFilters {
  dateRange: string;
  staffMember: string;
  clientType: string;
  taskStatus: string;
  taskCategory: string;
}

interface AnalyticsKPICardsProps {
  filters: AnalyticsFilters;
}

const AnalyticsKPICards: React.FC<AnalyticsKPICardsProps> = ({ filters }) => {
  const { data: kpiData, isLoading } = useQuery({
    queryKey: ['analytics-kpi', filters],
    queryFn: async () => {
      // Fetch active clients
      const { data: activeClients } = await supabase
        .from('clients')
        .select('id')
        .eq('status', 'Active');

      // Fetch active staff
      const { data: activeStaff } = await supabase
        .from('profiles')
        .select('id')
        .neq('role', 'client')
        .eq('is_active', true);

      // Fetch open tasks
      const { data: openTasks } = await supabase
        .from('tasks')
        .select('id')
        .in('status', ['to_do', 'in_progress', 'pending_approval', 'on_hold']);

      // Fetch completed tasks (with date filter)
      let completedTasksQuery = supabase
        .from('tasks')
        .select('id')
        .eq('status', 'completed');

      if (filters.dateRange !== 'all') {
        const days = parseInt(filters.dateRange);
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);
        completedTasksQuery = completedTasksQuery.gte('updated_at', dateThreshold.toISOString());
      }

      const { data: completedTasks } = await completedTasksQuery;

      // Fetch upcoming compliance deadlines
      const { data: upcomingDeadlines } = await supabase
        .from('compliance_deadlines')
        .select('id')
        .gte('deadline_date', new Date().toISOString().split('T')[0])
        .lte('deadline_date', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Fetch overdue compliance deadlines
      const { data: overdueDeadlines } = await supabase
        .from('compliance_deadlines')
        .select('id')
        .lt('deadline_date', new Date().toISOString().split('T')[0]);

      return {
        activeClients: activeClients?.length || 0,
        activeStaff: activeStaff?.length || 0,
        openTasks: openTasks?.length || 0,
        completedTasks: completedTasks?.length || 0,
        upcomingDeadlines: upcomingDeadlines?.length || 0,
        overdueDeadlines: overdueDeadlines?.length || 0,
      };
    },
  });

  const kpiCards = [
    {
      title: 'Active Clients',
      value: kpiData?.activeClients || 0,
      icon: Users,
      description: 'Total active clients',
      color: 'text-blue-600',
    },
    {
      title: 'Active Staff',
      value: kpiData?.activeStaff || 0,
      icon: UserCheck,
      description: 'Active staff members',
      color: 'text-green-600',
    },
    {
      title: 'Open Tasks',
      value: kpiData?.openTasks || 0,
      icon: FileText,
      description: 'Tasks in progress',
      color: 'text-orange-600',
    },
    {
      title: 'Completed Tasks',
      value: kpiData?.completedTasks || 0,
      icon: CheckCircle,
      description: `Last ${filters.dateRange === 'all' ? 'all time' : filters.dateRange + ' days'}`,
      color: 'text-green-600',
    },
    {
      title: 'Upcoming Deadlines',
      value: kpiData?.upcomingDeadlines || 0,
      icon: Calendar,
      description: 'Next 30 days',
      color: 'text-yellow-600',
    },
    {
      title: 'Overdue Deadlines',
      value: kpiData?.overdueDeadlines || 0,
      icon: AlertTriangle,
      description: 'Requires attention',
      color: 'text-red-600',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AnalyticsKPICards;
