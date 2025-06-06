import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle,
  AlertCircle,
  User,
  Bell,
  Settings,
  CreditCard
} from 'lucide-react';
import GSTOnboardingChecklist from '@/components/gst/GSTOnboardingChecklist';
import ClientSidebar from '@/components/client/ClientSidebar';
import IncomeTaxApp from '@/components/client/IncomeTaxApp';
import FileITR from '@/components/client/FileITR';
import PastITRFilings from '@/components/client/PastITRFilings';

const ClientDashboard = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState([
    {
      id: 1,
      title: "Document Submission Required",
      message: "Please upload your PAN card for GST registration",
      type: "warning",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Application Status Update",
      message: "Your GST application is under review",
      type: "info",
      time: "1 day ago"
    }
  ]);

  const [recentDocuments] = useState([
    {
      id: 1,
      name: "GST Registration Form",
      status: "pending",
      lastUpdated: "2024-01-15",
      category: "Registration"
    },
    {
      id: 2,
      name: "Income Tax Return",
      status: "completed",
      lastUpdated: "2024-01-10",
      category: "Tax Filing"
    },
    {
      id: 3,
      name: "Compliance Certificate",
      status: "draft",
      lastUpdated: "2024-01-08",
      category: "Compliance"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      draft: 'outline',
      rejected: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 urgent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Your latest document activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(doc.status)}
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.category} • {doc.lastUpdated}</p>
                    </div>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Stay updated with important alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <Card>
      <CardHeader>
        <CardTitle>Document Management</CardTitle>
        <CardDescription>Upload, view, and manage your documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Document Library
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Access and manage all your documents in one place
          </p>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            View All Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderGSTRegistration = () => (
    <div className="space-y-6">
      {/* Updated Disclaimer */}
      <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
            Important Pro-Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Ensure all uploaded files (JPEG/PDF) are under <strong>100 KB</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>For rented or shared premises, a <strong>No Objection Certificate (NOC)</strong> from the owner is mandatory and a common point of rejection if missed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>The name and address on all documents must <strong>exactly match</strong> the details in the application form to avoid delays.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>GST Registration Onboarding</CardTitle>
          <CardDescription>Complete your GST registration with our guided checklist</CardDescription>
        </CardHeader>
        <CardContent>
          <GSTOnboardingChecklist isClient={true} />
        </CardContent>
      </Card>
    </div>
  );

  const renderBilling = () => (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Payments</CardTitle>
        <CardDescription>Manage your billing information and payment history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Billing Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            View invoices, payment history, and billing details
          </p>
          <Button variant="outline">
            View Billing History
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'documents':
        return renderDocuments();
      case 'gst-registration':
        return renderGSTRegistration();
      case 'income-tax':
        return <IncomeTaxApp />;
      case 'file-itr':
        return <FileITR />;
      case 'past-itr':
        return <PastITRFilings />;
      case 'billing':
        return renderBilling();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          <ClientSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <SidebarInset className="flex-1">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Welcome back, {profile?.full_name || 'Client'}
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {profile?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {renderContent()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ClientDashboard;
