
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, CheckCircle } from 'lucide-react';

interface AnalyticsFilters {
  dateRange: string;
  staffMember: string;
  clientType: string;
  taskStatus: string;
  taskCategory: string;
}

interface ComplianceAnalyticsProps {
  filters: AnalyticsFilters;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ComplianceAnalytics: React.FC<ComplianceAnalyticsProps> = ({ filters }) => {
  const { data: complianceOverviewData } = useQuery({
    queryKey: ['compliance-overview', filters],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const next30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Upcoming deadlines (next 30 days)
      const { data: upcoming } = await supabase
        .from('compliance_deadlines')
        .select('id')
        .gte('deadline_date', today)
        .lte('deadline_date', next30Days);

      // Today's deadlines
      const { data: todayDeadlines } = await supabase
        .from('compliance_deadlines')
        .select('id')
        .eq('deadline_date', today);

      // Overdue deadlines
      const { data: overdue } = await supabase
        .from('compliance_deadlines')
        .select('id')
        .lt('deadline_date', today);

      return {
        upcoming: upcoming?.length || 0,
        today: todayDeadlines?.length || 0,
        overdue: overdue?.length || 0,
      };
    },
  });

  const { data: complianceByTypeData } = useQuery({
    queryKey: ['compliance-by-type', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('compliance_deadlines')
        .select('compliance_type');

      if (!data) return [];

      const typeGroups: { [key: string]: number } = {};
      data.forEach(deadline => {
        typeGroups[deadline.compliance_type] = (typeGroups[deadline.compliance_type] || 0) + 1;
      });

      return Object.entries(typeGroups).map(([type, count]) => ({
        name: type,
        value: count,
      }));
    },
  });

  const { data: itReturnsData } = useQuery({
    queryKey: ['it-returns', filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('client_it_returns')
        .select('status, assessment_year');

      if (!data) return { statusData: [], yearData: [] };

      const statusGroups: { [key: string]: number } = {};
      const yearGroups: { [key: string]: number } = {};

      data.forEach(returnRecord => {
        statusGroups[returnRecord.status || 'Unknown'] = (statusGroups[returnRecord.status || 'Unknown'] || 0) + 1;
        yearGroups[returnRecord.assessment_year || 'Unknown'] = (yearGroups[returnRecord.assessment_year || 'Unknown'] || 0) + 1;
      });

      const statusData = Object.entries(statusGroups).map(([status, count]) => ({
        status,
        count,
      }));

      const yearData = Object.entries(yearGroups).map(([year, count]) => ({
        year,
        count,
      }));

      return { statusData, yearData };
    },
  });

  const { data: dscCertificatesData } = useQuery({
    queryKey: ['dsc-certificates', filters],
    queryFn: async () => {
      const today = new Date();
      const next30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const next60Days = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
      const next90Days = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      // Active certificates
      const { data: active } = await supabase
        .from('dsc_certificates')
        .select('id')
        .eq('status', 'Active');

      // Expired certificates
      const { data: expired } = await supabase
        .from('dsc_certificates')
        .select('id')
        .neq('status', 'Active');

      // Expiring in 30 days
      const { data: expiring30 } = await supabase
        .from('dsc_certificates')
        .select(`
          id,
          certificate_holder_profile_id,
          valid_until,
          profiles:certificate_holder_profile_id(full_name)
        `)
        .eq('status', 'Active')
        .gte('valid_until', today.toISOString())
        .lte('valid_until', next30Days.toISOString());

      // Expiring in 60 days
      const { data: expiring60 } = await supabase
        .from('dsc_certificates')
        .select('id')
        .eq('status', 'Active')
        .gte('valid_until', next30Days.toISOString())
        .lte('valid_until', next60Days.toISOString());

      // Expiring in 90 days
      const { data: expiring90 } = await supabase
        .from('dsc_certificates')
        .select('id')
        .eq('status', 'Active')
        .gte('valid_until', next60Days.toISOString())
        .lte('valid_until', next90Days.toISOString());

      return {
        active: active?.length || 0,
        expired: expired?.length || 0,
        expiring30: expiring30?.length || 0,
        expiring60: expiring60?.length || 0,
        expiring90: expiring90?.length || 0,
        expiringCertificates: expiring30 || [],
      };
    },
  });

  return (
    <div className="space-y-6">
      {/* Compliance Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceOverviewData?.upcoming || 0}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deadlines</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceOverviewData?.today || 0}</div>
            <p className="text-xs text-muted-foreground">Due today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Deadlines</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceOverviewData?.overdue || 0}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* DSC Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active DSCs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dscCertificatesData?.active || 0}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired DSCs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dscCertificatesData?.expired || 0}</div>
            <p className="text-xs text-muted-foreground">Need renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring (30d)</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dscCertificatesData?.expiring30 || 0}</div>
            <p className="text-xs text-muted-foreground">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring (60d)</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dscCertificatesData?.expiring60 || 0}</div>
            <p className="text-xs text-muted-foreground">Next 60 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring (90d)</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dscCertificatesData?.expiring90 || 0}</div>
            <p className="text-xs text-muted-foreground">Next 90 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Deadlines by Type</CardTitle>
            <CardDescription>Distribution of compliance requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {complianceByTypeData && (
                <ChartContainer
                  config={{
                    value: {
                      label: "Deadlines",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={complianceByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complianceByTypeData.map((entry, index) => (
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
            <CardTitle>IT Returns by Status</CardTitle>
            <CardDescription>Filing status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {itReturnsData?.statusData && (
                <ChartContainer
                  config={{
                    count: {
                      label: "Returns",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <BarChart data={itReturnsData.statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
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
            <CardTitle>IT Returns by Assessment Year</CardTitle>
            <CardDescription>Returns filed by year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {itReturnsData?.yearData && (
                <ChartContainer
                  config={{
                    count: {
                      label: "Returns",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <BarChart data={itReturnsData.yearData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
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
            <CardTitle>DSC Certificates Expiring Soon</CardTitle>
            <CardDescription>Certificates expiring in the next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate Holder</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Days Remaining</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dscCertificatesData?.expiringCertificates.map((cert: any) => {
                    const daysRemaining = Math.ceil((new Date(cert.valid_until).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <TableRow key={cert.id}>
                        <TableCell className="font-medium">
                          {cert.profiles?.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell>{new Date(cert.valid_until).toLocaleDateString()}</TableCell>
                        <TableCell>{daysRemaining} days</TableCell>
                        <TableCell>
                          <Badge variant={daysRemaining <= 7 ? 'destructive' : daysRemaining <= 15 ? 'default' : 'secondary'}>
                            {daysRemaining <= 7 ? 'Critical' : daysRemaining <= 15 ? 'Warning' : 'Notice'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplianceAnalytics;
