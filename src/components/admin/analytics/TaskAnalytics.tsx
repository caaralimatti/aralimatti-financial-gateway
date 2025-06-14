
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface AnalyticsFilters {
  dateRange: string;
  staffMember: string;
  clientType: string;
  taskStatus: string;
  taskCategory: string;
}

interface TaskAnalyticsProps {
  filters: AnalyticsFilters;
  showOverview?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ filters, showOverview = false }) => {
  const { data: taskStatusData } = useQuery({
    queryKey: ['task-status', filters],
    queryFn: async () => {
      let query = supabase.from('tasks').select('status');
      
      if (filters.taskStatus !== 'all') {
        query = query.eq('status', filters.taskStatus);
      }

      const { data } = await query;
      if (!data) return [];

      const statusGroups: { [key: string]: number } = {};
      data.forEach(task => {
        statusGroups[task.status] = (statusGroups[task.status] || 0) + 1;
      });

      return Object.entries(statusGroups).map(([status, count]) => ({
        name: status.replace('_', ' ').toUpperCase(),
        value: count,
      }));
    },
  });

  const { data: taskPriorityData } = useQuery({
    queryKey: ['task-priority', filters],
    queryFn: async () => {
      const { data } = await supabase.from('tasks').select('priority');
      if (!data) return [];

      const priorityGroups: { [key: string]: number } = {};
      data.forEach(task => {
        priorityGroups[task.priority] = (priorityGroups[task.priority] || 0) + 1;
      });

      return Object.entries(priorityGroups).map(([priority, count]) => ({
        priority: priority.toUpperCase(),
        count,
      }));
    },
  });

  const { data: taskCategoryData } = useQuery({
    queryKey: ['task-category', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select(`
          category_id,
          task_categories(name)
        `);

      if (!data) return [];

      const categoryGroups: { [key: string]: number } = {};
      data.forEach(task => {
        const categoryName = (task.task_categories as any)?.name || 'Uncategorized';
        categoryGroups[categoryName] = (categoryGroups[categoryName] || 0) + 1;
      });

      return Object.entries(categoryGroups).map(([category, count]) => ({
        category,
        count,
      }));
    },
  });

  const { data: completionTrendData } = useQuery({
    queryKey: ['completion-trend', filters],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select('updated_at')
        .eq('status', 'completed')
        .order('updated_at', { ascending: true });

      if (filters.dateRange !== 'all') {
        const days = parseInt(filters.dateRange);
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - days);
        query = query.gte('updated_at', dateThreshold.toISOString());
      }

      const { data } = await query;
      if (!data) return [];

      // Group by week
      const weeklyData: { [key: string]: number } = {};
      data.forEach(task => {
        const date = new Date(task.updated_at);
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
        const weekKey = weekStart.toISOString().split('T')[0];
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
      });

      return Object.entries(weeklyData).map(([week, count]) => ({
        week,
        completed: count,
      }));
    },
  });

  const { data: overdueTasksData } = useQuery({
    queryKey: ['overdue-tasks', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          deadline_date,
          priority,
          status,
          assigned_to:profiles!assigned_to_profile_id(full_name),
          client:clients(name)
        `)
        .not('status', 'eq', 'completed')
        .not('deadline_date', 'is', null)
        .lt('deadline_date', new Date().toISOString().split('T')[0])
        .order('deadline_date', { ascending: true });

      return data || [];
    },
  });

  const { data: staffPerformanceData } = useQuery({
    queryKey: ['staff-performance', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('tasks')
        .select(`
          assigned_to_profile_id,
          status,
          created_at,
          updated_at,
          assigned_to:profiles!assigned_to_profile_id(full_name)
        `);

      if (!data) return [];

      const staffStats: { [key: string]: any } = {};
      
      data.forEach(task => {
        const staffName = (task.assigned_to as any)?.full_name || 'Unassigned';
        if (!staffStats[staffName]) {
          staffStats[staffName] = {
            staff: staffName,
            total: 0,
            completed: 0,
            inProgress: 0,
            avgCompletionTime: 0,
          };
        }

        staffStats[staffName].total += 1;
        
        if (task.status === 'completed') {
          staffStats[staffName].completed += 1;
          // Calculate completion time in days
          const created = new Date(task.created_at);
          const updated = new Date(task.updated_at);
          const completionTime = (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          staffStats[staffName].avgCompletionTime += completionTime;
        } else if (task.status === 'in_progress') {
          staffStats[staffName].inProgress += 1;
        }
      });

      // Calculate averages
      Object.values(staffStats).forEach((stats: any) => {
        if (stats.completed > 0) {
          stats.avgCompletionTime = Math.round(stats.avgCompletionTime / stats.completed * 10) / 10;
        }
      });

      return Object.values(staffStats);
    },
  });

  if (showOverview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Overview</CardTitle>
          <CardDescription>Current task status and priority distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium mb-2">Tasks by Status</h4>
              {taskStatusData && (
                <ChartContainer
                  config={{
                    value: {
                      label: "Tasks",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>Distribution of task statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {taskStatusData && (
                <ChartContainer
                  config={{
                    value: {
                      label: "Tasks",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
            <CardDescription>Task priority distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {taskPriorityData && (
                <ChartContainer
                  config={{
                    count: {
                      label: "Tasks",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <BarChart data={taskPriorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks by Category</CardTitle>
            <CardDescription>Task distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {taskCategoryData && (
                <ChartContainer
                  config={{
                    count: {
                      label: "Tasks",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <BarChart data={taskCategoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="#FFBB28" />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion Trend</CardTitle>
            <CardDescription>Weekly task completion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {completionTrendData && (
                <ChartContainer
                  config={{
                    completed: {
                      label: "Completed Tasks",
                      color: "hsl(var(--chart-4))",
                    },
                  }}
                >
                  <LineChart data={completionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="completed" stroke="#FF8042" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overdue Tasks</CardTitle>
            <CardDescription>Tasks that have passed their deadline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueTasksData?.map((task: any) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.client?.name || 'N/A'}</TableCell>
                      <TableCell>{task.assigned_to?.full_name || 'Unassigned'}</TableCell>
                      <TableCell>{new Date(task.deadline_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>Task assignment and completion metrics by staff</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>In Progress</TableHead>
                    <TableHead>Avg Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPerformanceData?.map((staff: any) => (
                    <TableRow key={staff.staff}>
                      <TableCell className="font-medium">{staff.staff}</TableCell>
                      <TableCell>{staff.total}</TableCell>
                      <TableCell>{staff.completed}</TableCell>
                      <TableCell>{staff.inProgress}</TableCell>
                      <TableCell>{staff.avgCompletionTime || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskAnalytics;
