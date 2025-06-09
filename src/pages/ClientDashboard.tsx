
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  SidebarProvider, 
  SidebarInset
} from '@/components/ui/sidebar';
import ClientSidebar from '@/components/client/ClientSidebar';
import GSTHeader from '@/components/gst/GSTHeader';
import DocumentListCard from '@/components/client/DocumentListCard';
import GSTRegistration from '@/pages/GSTRegistration';
import IncomeTaxQuickGlance from '@/components/client/IncomeTaxQuickGlance';
import FileITR from '@/components/client/FileITR';
import PastITRFilings from '@/components/client/PastITRFilings';
import MyTasks from '@/components/client/MyTasks';
import TaskCalendar from '@/components/client/TaskCalendar';

const ClientDashboard = () => {
  const { profile, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Your Client Portal
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Access your documents, track your tax filings, and manage your tasks all in one place.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocumentListCard
                title="GST Returns"
                description="View and download your GST return files"
                fileCount={12}
                lastUpdated="2024-03-15"
              />
              <DocumentListCard
                title="Income Tax Returns"
                description="Access your ITR documents and filings"
                fileCount={8}
                lastUpdated="2024-03-10"
              />
              <DocumentListCard
                title="Audit Reports"
                description="Download audit reports and related documents"
                fileCount={5}
                lastUpdated="2024-03-08"
              />
            </div>
          </div>
        );
      
      case 'documents':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocumentListCard
                title="GST Returns"
                description="View and download your GST return files"
                fileCount={12}
                lastUpdated="2024-03-15"
              />
              <DocumentListCard
                title="Income Tax Returns"
                description="Access your ITR documents and filings"
                fileCount={8}
                lastUpdated="2024-03-10"
              />
              <DocumentListCard
                title="Audit Reports"
                description="Download audit reports and related documents"
                fileCount={5}
                lastUpdated="2024-03-08"
              />
              <DocumentListCard
                title="Compliance Documents"
                description="ROC filings and compliance certificates"
                fileCount={15}
                lastUpdated="2024-03-12"
              />
              <DocumentListCard
                title="Financial Statements"
                description="Balance sheet, P&L and other financial documents"
                fileCount={6}
                lastUpdated="2024-03-05"
              />
              <DocumentListCard
                title="Tax Certificates"
                description="TDS certificates and other tax documents"
                fileCount={20}
                lastUpdated="2024-03-18"
              />
            </div>
          </div>
        );

      case 'gst-registration':
        return <GSTRegistration />;

      case 'income-tax-quick-glance':
        return <IncomeTaxQuickGlance />;

      case 'file-itr':
        return <FileITR />;

      case 'past-itr':
        return <PastITRFilings />;

      case 'my-tasks':
        return <MyTasks />;

      case 'task-calendar':
        return <TaskCalendar />;

      case 'billing':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Payments</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                Billing and payment management features will be available soon.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              The requested page could not be found.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          <ClientSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <SidebarInset className="flex-1">
            <GSTHeader
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              profile={profile}
              onLogout={handleLogout}
            />

            <main className="p-6">
              {renderContent()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ClientDashboard;
