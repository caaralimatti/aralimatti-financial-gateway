
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import StaffSidebar from '@/components/staff/StaffSidebar';
import StaffDashboardStats from '@/components/staff/StaffDashboardStats';
import StaffQuickAccess from '@/components/staff/StaffQuickAccess';
import StaffRecentMessages from '@/components/staff/StaffRecentMessages';
import StaffAnnouncements from '@/components/staff/StaffAnnouncements';
import DSCManagement from '@/components/admin/DSCManagement';
import { useAuth } from '@/contexts/AuthContext';

const StaffDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'clients':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Client Management</h1>
            <p className="text-gray-600">Client management interface for staff coming soon...</p>
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Document Management</h1>
            <p className="text-gray-600">Document management interface for staff coming soon...</p>
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Task Management</h1>
            <p className="text-gray-600">Task management interface for staff coming soon...</p>
          </div>
        );
      case 'dsc':
        return <DSCManagement />;
      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-600">Staff settings coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <StaffDashboardStats />
                <StaffQuickAccess />
              </div>
              <div className="lg:col-span-1 space-y-6">
                <StaffRecentMessages />
                <StaffAnnouncements />
              </div>
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
                Welcome, {profile?.full_name || 'Staff User'}
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
