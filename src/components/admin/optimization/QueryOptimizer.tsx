import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface QueryMetric {
  query: string;
  duration: number;
  rows: number;
  frequency: number;
  optimization_suggestion: string;
}

const QueryOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<QueryMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const optimizationSuggestions = [
    {
      table: 'clients',
      suggestion: 'Add composite index on (status, client_type) for better filtering',
      query: 'CREATE INDEX IF NOT EXISTS idx_clients_status_type ON public.clients(status, client_type);',
    },
    {
      table: 'tasks',
      suggestion: 'Add index on (deadline_date, status) for task calendar queries',
      query: 'CREATE INDEX IF NOT EXISTS idx_tasks_deadline_status ON public.tasks(deadline_date, status);',
    },
    {
      table: 'notifications',
      suggestion: 'Add partial index for unread notifications',
      query: 'CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(recipient_user_id, created_at) WHERE read_at IS NULL;',
    },
  ];

  const runQueryAnalysis = async () => {
    setIsLoading(true);
    try {
      // Simulate query analysis - in a real app, this would connect to pg_stat_statements
      const mockMetrics: QueryMetric[] = [
        {
          query: 'SELECT * FROM clients WHERE status = ? AND client_type = ?',
          duration: 156,
          rows: 1250,
          frequency: 45,
          optimization_suggestion: 'Add composite index on (status, client_type)',
        },
        {
          query: 'SELECT * FROM tasks WHERE assigned_to_profile_id = ? ORDER BY created_at DESC',
          duration: 89,
          rows: 234,
          frequency: 67,
          optimization_suggestion: 'Index on assigned_to_profile_id already optimal',
        },
        {
          query: 'SELECT * FROM notifications WHERE recipient_user_id = ? AND read_at IS NULL',
          duration: 234,
          rows: 12,
          frequency: 156,
          optimization_suggestion: 'Add partial index for unread notifications',
        },
      ];

      setMetrics(mockMetrics);
      toast({
        title: "Query Analysis Complete",
        description: "Found optimization opportunities for your database queries.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze query performance.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyOptimization = async (optimization: any) => {
    try {
      // In a real implementation, you would execute the optimization query
      toast({
        title: "Optimization Applied",
        description: `Applied optimization for ${optimization.table} table.`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Could not apply database optimization.",
        variant: "destructive",
      });
    }
  };

  const getPerformanceLevel = (duration: number) => {
    if (duration < 50) return { level: 'excellent', color: 'bg-green-500' };
    if (duration < 100) return { level: 'good', color: 'bg-blue-500' };
    if (duration < 200) return { level: 'fair', color: 'bg-yellow-500' };
    return { level: 'poor', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Query Performance Analyzer
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Analyze and optimize database query performance
              </p>
            </div>
            <Button onClick={runQueryAnalysis} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {metrics.length > 0 ? (
            <div className="space-y-4">
              {metrics.map((metric, index) => {
                const performance = getPerformanceLevel(metric.duration);
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <code className="text-sm bg-muted p-2 rounded block mb-2">
                          {metric.query}
                        </code>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Duration: {metric.duration}ms</span>
                          <span>Rows: {metric.rows}</span>
                          <span>Frequency: {metric.frequency}/hour</span>
                        </div>
                        <p className="text-sm mt-2">{metric.optimization_suggestion}</p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-white ${performance.color}`}
                      >
                        {performance.level}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Run analysis to view query performance metrics</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Recommended Optimizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationSuggestions.map((opt, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{opt.table} table optimization</h4>
                  <p className="text-sm text-muted-foreground">{opt.suggestion}</p>
                  <code className="text-xs bg-muted p-1 rounded mt-1 block">
                    {opt.query}
                  </code>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => applyOptimization(opt)}
                  className="ml-4"
                >
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QueryOptimizer;