
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Calendar,
  DollarSign,
  Target,
  Download,
  Upload
} from 'lucide-react';

const IncomeTaxQuickGlance = () => {
  const [currentYear] = useState('AY 2024-25');

  const taxSummary = {
    totalIncome: '₹12,50,000',
    taxPayable: '₹1,87,500',
    taxPaid: '₹2,00,000',
    refundDue: '₹12,500',
    filingStatus: 'Filed',
    dueDate: 'July 31, 2024',
    lastFiled: 'July 15, 2024'
  };

  const quickStats = [
    {
      title: 'Current Assessment Year',
      value: currentYear,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Income',
      value: taxSummary.totalIncome,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Tax Payable',
      value: taxSummary.taxPayable,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Refund Due',
      value: taxSummary.refundDue,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'ITR Filed for AY 2024-25',
      date: 'July 15, 2024',
      status: 'completed',
      type: 'filing'
    },
    {
      id: 2,
      action: 'Form 16 Uploaded',
      date: 'July 10, 2024',
      status: 'completed',
      type: 'document'
    },
    {
      id: 3,
      action: 'Processing Started',
      date: 'July 16, 2024',
      status: 'in-progress',
      type: 'processing'
    },
    {
      id: 4,
      action: 'Refund Expected',
      date: 'August 15, 2024',
      status: 'pending',
      type: 'refund'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      'in-progress': 'secondary',
      pending: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Income Tax Quick Glance</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your income tax status for {currentYear}
          </p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <FileText className="h-3 w-3 mr-1" />
          Tax Overview
        </Badge>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tax Summary and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Summary</CardTitle>
            <CardDescription>Current assessment year overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-medium">Filing Status</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                {taxSummary.filingStatus}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date</span>
                <span className="font-medium">{taxSummary.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Filed</span>
                <span className="font-medium">{taxSummary.lastFiled}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Paid</span>
                <span className="font-medium">{taxSummary.taxPaid}</span>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download ITR Copy
              </Button>
              <Button className="w-full" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Tax Computation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates on your tax filing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(activity.status)}
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  {getStatusBadge(activity.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tax-related tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Upload className="h-6 w-6 mb-2" />
              <span>Upload Documents</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span>File New ITR</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Track Refund</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncomeTaxQuickGlance;
