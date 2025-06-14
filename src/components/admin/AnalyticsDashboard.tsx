
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnalyticsKPICards from './analytics/AnalyticsKPICards';
import ClientAnalytics from './analytics/ClientAnalytics';
import TaskAnalytics from './analytics/TaskAnalytics';
import ComplianceAnalytics from './analytics/ComplianceAnalytics';
import AnalyticsFilters from './analytics/AnalyticsFilters';

interface AnalyticsFilters {
  dateRange: string;
  staffMember: string;
  clientType: string;
  taskStatus: string;
  taskCategory: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: '30',
    staffMember: 'all',
    clientType: 'all',
    taskStatus: 'all',
    taskCategory: 'all',
  });

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive insights and performance metrics for your business
          </p>
        </div>
      </div>

      <AnalyticsFilters filters={filters} onFilterChange={handleFilterChange} />

      <AnalyticsKPICards filters={filters} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClientAnalytics filters={filters} showOverview={true} />
            <TaskAnalytics filters={filters} showOverview={true} />
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <ClientAnalytics filters={filters} showOverview={false} />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TaskAnalytics filters={filters} showOverview={false} />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <ComplianceAnalytics filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
