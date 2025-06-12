
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import IncomeTaxApp from '@/components/client/IncomeTaxApp';
import FileITR from '@/components/client/FileITR';
import PastITRFilings from '@/components/client/PastITRFilings';
import StaffDashboardHeader from '@/components/staff/StaffDashboardHeader';
import StaffDashboardStats from '@/components/staff/StaffDashboardStats';
import StaffQuickAccess from '@/components/staff/StaffQuickAccess';
import StaffRecentMessages from '@/components/staff/StaffRecentMessages';
import StaffAnnouncements from '@/components/staff/StaffAnnouncements';
import StaffSidebar from '@/components/staff/StaffSidebar';

const StaffDashboard = () => {
  const { profile, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [incomeTaxOpen, setIncomeTaxOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'income-tax-quick':
        return <IncomeTaxApp />;
      case 'file-itr-staff':
        return <FileITR />;
      case 'past-itr-staff':
        return <PastITRFilings />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.full_name || 'Staff Member'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your clients today.
          </p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200">
          All systems operational
        </Badge>
      </div>

      {/* Stats Cards */}
      <StaffDashboardStats />

      {/* Quick Access & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaffQuickAccess />
        <StaffRecentMessages />
      </div>

      {/* Announcements Banner */}
      <StaffAnnouncements />
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <StaffSidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            incomeTaxOpen={incomeTaxOpen}
            setIncomeTaxOpen={setIncomeTaxOpen}
          />

          {/* Main Content */}
          <SidebarInset className="flex-1">
            {/* Top Navbar */}
            <StaffDashboardHeader 
              profile={profile}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              handleLogout={handleLogout}
            />

            {/* Dashboard Content */}
            <main className="p-6 space-y-6">
              {renderContent()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StaffDashboard;
