import React, { Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Database, TrendingUp, Settings } from 'lucide-react';

// Lazy load performance components
const PerformanceMonitor = lazy(() => import('@/components/admin/performance/PerformanceMonitor'));
const QueryOptimizer = lazy(() => import('@/components/admin/optimization/QueryOptimizer'));

const AdminPerformancePage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Dashboard</h1>
          <p className="text-muted-foreground">Monitor and optimize system performance</p>
        </div>
      </div>

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="queries" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Query Optimizer
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="space-y-6">
          <Suspense fallback={<div className="animate-pulse bg-muted rounded-lg h-48" />}>
            <PerformanceMonitor />
          </Suspense>
        </TabsContent>

        <TabsContent value="queries" className="space-y-6">
          <Suspense fallback={<div className="animate-pulse bg-muted rounded-lg h-96" />}>
            <QueryOptimizer />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Advanced analytics coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Performance configuration options coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPerformancePage;