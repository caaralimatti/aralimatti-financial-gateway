
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { FileSpreadsheet, Download, Filter, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import GSTSidebar from '@/components/gst/GSTSidebar';
import GSTHeader from '@/components/gst/GSTHeader';

const GSTReports = () => {
  const { profile, signOut } = useAuth();
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    month: '',
    status: '',
    clientName: ''
  });

  // Mock data for reports
  const filingStats = [
    {
      title: 'Total Filed Returns',
      value: '1,245',
      change: '+15 this month',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Returns',
      value: '23',
      change: '8 due this week',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Overdue Returns',
      value: '5',
      change: '-2 from last week',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Compliance Rate',
      value: '96.8%',
      change: '+1.2% this quarter',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const reportsData = [
    {
      id: 1,
      clientName: 'ABC Pvt Ltd',
      gstin: '29ABCDE1234F1Z5',
      lastReturnFiled: '2024-01-20',
      filingStatus: 'Filed',
      nextDueDate: '2024-02-20'
    },
    {
      id: 2,
      clientName: 'XYZ Corp',
      gstin: '27XYZAB5678G2W4',
      lastReturnFiled: '2024-01-15',
      filingStatus: 'Pending',
      nextDueDate: '2024-02-20'
    },
    {
      id: 3,
      clientName: 'DEF Industries',
      gstin: '19DEFGH9012H3X6',
      lastReturnFiled: '2023-12-18',
      filingStatus: 'Overdue',
      nextDueDate: '2024-01-20'
    },
    {
      id: 4,
      clientName: 'GHI Enterprises',
      gstin: '36GHIJK3456I4Y7',
      lastReturnFiled: '2024-01-22',
      filingStatus: 'Filed',
      nextDueDate: '2024-02-20'
    },
    {
      id: 5,
      clientName: 'JKL Trading Co',
      gstin: '24JKLMN7890J5Z8',
      lastReturnFiled: '2024-01-10',
      filingStatus: 'Filed',
      nextDueDate: '2024-02-20'
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportExcel = () => {
    toast({
      title: "Export Started",
      description: "Your Excel report is being generated...",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started", 
      description: "Your PDF report is being generated...",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Filed':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Filed
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Overdue':
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          <GSTSidebar />

          <SidebarInset className="flex-1">
            <GSTHeader
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              profile={profile}
              onLogout={handleLogout}
            />

            <main className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    GST Filing Reports
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Track GST filing status and compliance for all clients
                  </p>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <FileSpreadsheet className="h-3 w-3 mr-1" />
                  Reports Dashboard
                </Badge>
              </div>

              {/* Filing Status Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filingStats.map((stat, index) => (
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Filters and Export */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter & Export Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="month">Month/Quarter</Label>
                      <Select value={filters.month} onValueChange={(value) => handleFilterChange('month', value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jan-2024">January 2024</SelectItem>
                          <SelectItem value="feb-2024">February 2024</SelectItem>
                          <SelectItem value="mar-2024">March 2024</SelectItem>
                          <SelectItem value="q1-2024">Q1 2024</SelectItem>
                          <SelectItem value="q2-2024">Q2 2024</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Filing Status</Label>
                      <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="filed">Filed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input
                        id="clientName"
                        placeholder="Search client..."
                        value={filters.clientName}
                        onChange={(e) => handleFilterChange('clientName', e.target.value)}
                        className="w-48"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleExportExcel} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Excel
                      </Button>
                      <Button onClick={handleExportPDF} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reports Data Table */}
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    GST Filing Status Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>GSTIN</TableHead>
                        <TableHead>Last Return Filed</TableHead>
                        <TableHead>Filing Status</TableHead>
                        <TableHead>Next Due Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportsData.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.clientName}</TableCell>
                          <TableCell>{report.gstin}</TableCell>
                          <TableCell>{new Date(report.lastReturnFiled).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(report.filingStatus)}</TableCell>
                          <TableCell>
                            <span className={
                              new Date(report.nextDueDate) < new Date() 
                                ? 'text-red-600 font-medium' 
                                : 'text-gray-900 dark:text-white'
                            }>
                              {new Date(report.nextDueDate).toLocaleDateString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default GSTReports;
