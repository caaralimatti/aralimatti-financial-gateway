
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface GSTComplexityChartProps {
  selectedEntity: string | null;
}

const gstDocCounts = {
  proprietorship: { label: 'Sole Proprietorship', count: 7 },
  partnership: { label: 'Partnership Firm', count: 9 },
  llp: { label: 'LLP', count: 10 },
  pvt_ltd: { label: 'Private Ltd. Co.', count: 11 },
  pub_ltd: { label: 'Public Ltd. Co.', count: 11 },
  huf: { label: 'HUF', count: 8 },
  aop: { label: 'Trust / Society / AOP', count: 9 }
};

const GSTComplexityChart: React.FC<GSTComplexityChartProps> = ({ selectedEntity }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Dynamically import Chart.js to avoid SSR issues
    import('chart.js/auto').then((Chart) => {
      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;

      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const data = Object.entries(gstDocCounts).map(([key, value]) => ({
        label: value.label,
        count: value.count,
        isSelected: key === selectedEntity
      }));

      chartInstance.current = new Chart.default(ctx, {
        type: 'bar',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            label: 'Document Count',
            data: data.map(d => d.count),
            backgroundColor: data.map(d => d.isSelected ? '#0d9488' : '#a7f3d0'),
            borderColor: data.map(d => d.isSelected ? '#047857' : '#6ee7b7'),
            borderWidth: 2,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Document Complexity by Business Type',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Documents'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Business Type'
              },
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            }
          }
        }
      });
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [selectedEntity]);

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Document Complexity Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-80">
          <canvas ref={chartRef} />
        </div>
      </CardContent>
    </Card>
  );
};

export default GSTComplexityChart;
