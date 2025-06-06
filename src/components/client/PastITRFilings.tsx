
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  FileText,
  Calendar,
  Filter
} from 'lucide-react';

const PastITRFilings = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const pastFilings = [
    {
      id: 1,
      assessmentYear: 'AY 2023-24',
      financialYear: 'FY 2022-23',
      status: 'processed',
      filedDate: '2023-07-25',
      acknowledgmentNumber: 'ITR123456789',
      refundAmount: '₹15,000',
      form: 'ITR-1'
    },
    {
      id: 2,
      assessmentYear: 'AY 2022-23',
      financialYear: 'FY 2021-22',
      status: 'verified',
      filedDate: '2022-07-20',
      acknowledgmentNumber: 'ITR987654321',
      refundAmount: '₹8,500',
      form: 'ITR-1'
    },
    {
      id: 3,
      assessmentYear: 'AY 2021-22',
      financialYear: 'FY 2020-21',
      status: 'pending',
      filedDate: '2021-07-30',
      acknowledgmentNumber: 'ITR456789123',
      refundAmount: '₹0',
      form: 'ITR-2'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      processed: 'default',
      verified: 'secondary',
      pending: 'outline',
      rejected: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredFilings = pastFilings.filter(filing =>
    filing.assessmentYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filing.acknowledgmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Past ITR Filings</h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your previous income tax returns
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          <FileText className="h-3 w-3 mr-1" />
          Filing History
        </Badge>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by assessment year or acknowledgment number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Filings</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">All years</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹23,500</div>
            <p className="text-xs text-muted-foreground">Processed refunds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Time Filings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Always on time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filings List */}
      <Card>
        <CardHeader>
          <CardTitle>Filing History</CardTitle>
          <CardDescription>Complete list of your ITR filings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredFilings.map((filing) => (
              <div key={filing.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(filing.status)}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {filing.assessmentYear} ({filing.financialYear})
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Form: {filing.form} • Filed: {filing.filedDate}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Acknowledgment: {filing.acknowledgmentNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {filing.refundAmount}
                      </p>
                      <p className="text-xs text-gray-500">Refund</p>
                    </div>
                    {getStatusBadge(filing.status)}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PastITRFilings;
