
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

interface AnalyticsFilters {
  dateRange: string;
  staffMember: string;
  clientType: string;
  taskStatus: string;
  taskCategory: string;
}

interface ClientAnalyticsProps {
  filters: AnalyticsFilters;
  showOverview?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ClientAnalytics: React.FC<ClientAnalyticsProps> = ({ filters, showOverview = false }) => {
  const { data: clientGrowthData } = useQuery({
    queryKey: ['client-growth', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('clients')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (!data) return [];

      // Group by month
      const monthlyData: { [key: string]: number } = {};
      data.forEach(client => {
        const date = new Date(client.created_at);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      });

      return Object.entries(monthlyData).map(([month, count]) => ({
        month,
        clients: count,
      }));
    },
  });

  const { data: clientTypeData } = useQuery({
    queryKey: ['client-types', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('clients')
        .select('client_type, status');

      if (!data) return { typeData: [], statusData: [] };

      // Group by client type
      const typeGroups: { [key: string]: number } = {};
      const statusGroups: { [key: string]: number } = {};

      data.forEach(client => {
        typeGroups[client.client_type] = (typeGroups[client.client_type] || 0) + 1;
        statusGroups[client.status] = (statusGroups[client.status] || 0) + 1;
      });

      const typeData = Object.entries(typeGroups).map(([type, count]) => ({
        name: type,
        value: count,
      }));

      const statusData = Object.entries(statusGroups).map(([status, count]) => ({
        name: status,
        value: count,
      }));

      return { typeData, statusData };
    },
  });

  const { data: serviceApplicabilityData } = useQuery({
    queryKey: ['service-applicability', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('clients')
        .select('gst_applicable, income_tax_applicable, mca_applicable, tds_tcs_applicable, other_tax_applicable');

      if (!data) return [];

      const services = [
        { name: 'GST', count: data.filter(c => c.gst_applicable).length },
        { name: 'Income Tax', count: data.filter(c => c.income_tax_applicable).length },
        { name: 'MCA', count: data.filter(c => c.mca_applicable).length },
        { name: 'TDS/TCS', count: data.filter(c => c.tds_tcs_applicable).length },
        { name: 'Other Tax', count: data.filter(c => c.other_tax_applicable).length },
      ];

      return services;
    },
  });

  const { data: staffDistributionData } = useQuery({
    queryKey: ['staff-distribution', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('clients')
        .select(`
          working_user_id,
          profiles:working_user_id(full_name)
        `)
        .not('working_user_id', 'is', null);

      if (!data) return [];

      const staffGroups: { [key: string]: number } = {};
      data.forEach(client => {
        const staffName = (client.profiles as any)?.full_name || 'Unassigned';
        staffGroups[staffName] = (staffGroups[staffName] || 0) + 1;
      });

      return Object.entries(staffGroups).map(([staff, count]) => ({
        staff,
        clients: count,
      }));
    },
  });

  if (showOverview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
          <CardDescription>Key client metrics and distributions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-64">
              <h4 className="text-sm font-medium mb-2">Clients by Type</h4>
              {clientTypeData?.typeData && (
                <ChartContainer
                  config={{
                    value: {
                      label: "Clients",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={clientTypeData.typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientTypeData.typeData.map((entry, index) => (
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
            <CardTitle>Client Growth Over Time</CardTitle>
            <CardDescription>Monthly new client registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {clientGrowthData && (
                <ChartContainer
                  config={{
                    clients: {
                      label: "New Clients",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <LineChart data={clientGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="clients" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clients by Type</CardTitle>
            <CardDescription>Distribution of client types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {clientTypeData?.typeData && (
                <ChartContainer
                  config={{
                    value: {
                      label: "Clients",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={clientTypeData.typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clientTypeData.typeData.map((entry, index) => (
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
            <CardTitle>Service Applicability</CardTitle>
            <CardDescription>Number of clients for each service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {serviceApplicabilityData && (
                <ChartContainer
                  config={{
                    count: {
                      label: "Clients",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <BarChart data={serviceApplicabilityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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
            <CardTitle>Client Distribution by Staff</CardTitle>
            <CardDescription>Number of clients assigned to each staff member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {staffDistributionData && (
                <ChartContainer
                  config={{
                    clients: {
                      label: "Clients",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <BarChart data={staffDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="staff" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="clients" fill="#FFBB28" />
                  </BarChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientAnalytics;
