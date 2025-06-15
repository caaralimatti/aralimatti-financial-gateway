import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import StaffSidebar from '@/components/staff/StaffSidebar';
import StaffDashboardStats from '@/components/staff/StaffDashboardStats';
import StaffQuickAccess from '@/components/staff/StaffQuickAccess';
import StaffAnnouncements from '@/components/staff/StaffAnnouncements';
import StaffRecentMessages from '@/components/staff/StaffRecentMessages';
import StaffTasksList from '@/components/staff/StaffTasksList';
import DSCManagement from '@/components/admin/DSCManagement';
import StaffDocumentsManager from "@/components/staff/StaffDocumentsManager";
import { useAuth } from '@/contexts/AuthContext';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const { profile } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <StaffTasksList />;
      case 'dsc':
        return <DSCManagement />;
      case 'reports':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-gray-600">Reports functionality coming soon...</p>
          </div>
        );
      case 'clients':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Client Management</h1>
            <p className="text-gray-600">Client management functionality coming soon...</p>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-600">Profile management coming soon...</p>
          </div>
        );
      case 'manage-documents':
        return <StaffDocumentsManager />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {profile?.full_name || profile?.email}
              </h1>
              <div className="text-sm text-gray-500">
                Staff Dashboard
              </div>
            </div>
            <StaffDashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StaffQuickAccess />
              <StaffRecentMessages />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StaffAnnouncements />
              <StaffTasksList />
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StaffSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.full_name || profile?.email}
              </span>
            </div>
          </header>
          <main className="flex-1 space-y-4 p-4 md:p-8">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default StaffDashboard;
