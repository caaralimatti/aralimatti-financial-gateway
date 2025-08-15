import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Database, Wifi } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
  });

  useEffect(() => {
    // Measure page load performance
    const measurePerformance = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

        // Get memory usage if available
        const memory = (performance as any).memory;
        const memoryUsage = memory ? memory.usedJSHeapSize / memory.jsHeapSizeLimit : 0;

        setMetrics(prev => ({
          ...prev,
          loadTime,
          renderTime,
          memoryUsage: memoryUsage * 100,
        }));
      }
    };

    measurePerformance();

    // Monitor network latency
    const measureNetworkLatency = async () => {
      const start = performance.now();
      try {
        await fetch('/api/health', { method: 'HEAD' });
        const end = performance.now();
        setMetrics(prev => ({
          ...prev,
          networkLatency: end - start,
        }));
      } catch (error) {
        console.warn('Network latency measurement failed:', error);
      }
    };

    measureNetworkLatency();
  }, []);

  const getPerformanceStatus = (metric: keyof PerformanceMetrics, value: number) => {
    switch (metric) {
      case 'loadTime':
        if (value < 1000) return 'excellent';
        if (value < 2000) return 'good';
        if (value < 3000) return 'fair';
        return 'poor';
      case 'renderTime':
        if (value < 100) return 'excellent';
        if (value < 300) return 'good';
        if (value < 500) return 'fair';
        return 'poor';
      case 'memoryUsage':
        if (value < 50) return 'excellent';
        if (value < 70) return 'good';
        if (value < 85) return 'fair';
        return 'poor';
      case 'networkLatency':
        if (value < 100) return 'excellent';
        if (value < 300) return 'good';
        if (value < 500) return 'fair';
        return 'poor';
      default:
        return 'unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatValue = (metric: keyof PerformanceMetrics, value: number) => {
    switch (metric) {
      case 'loadTime':
      case 'renderTime':
      case 'networkLatency':
        return `${Math.round(value)}ms`;
      case 'memoryUsage':
        return `${Math.round(value)}%`;
      default:
        return value.toString();
    }
  };

  const performanceData = [
    {
      key: 'loadTime' as const,
      label: 'Page Load Time',
      icon: Clock,
      value: metrics.loadTime,
    },
    {
      key: 'renderTime' as const,
      label: 'Render Time',
      icon: Activity,
      value: metrics.renderTime,
    },
    {
      key: 'memoryUsage' as const,
      label: 'Memory Usage',
      icon: Database,
      value: metrics.memoryUsage,
    },
    {
      key: 'networkLatency' as const,
      label: 'Network Latency',
      icon: Wifi,
      value: metrics.networkLatency,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {performanceData.map(({ key, label, icon: Icon, value }) => {
        const status = getPerformanceStatus(key, value);
        return (
          <Card key={key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatValue(key, value)}</div>
              <Badge
                variant="secondary"
                className={`mt-2 text-white ${getStatusColor(status)}`}
              >
                {status}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PerformanceMonitor;