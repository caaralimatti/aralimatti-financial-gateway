
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminManagementCards from '@/components/admin/AdminManagementCards';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';
import UserManagement from '@/components/admin/UserManagement';
import ClientManagement from '@/components/admin/ClientManagement';
import ClientImport from '@/components/admin/ClientImport';
import ClientBulkEdit from '@/components/admin/ClientBulkEdit';
import AdminTaskOverview from '@/components/admin/AdminTaskOverview';
import AdminTasksList from '@/components/admin/AdminTasksList';
import TaskCalendar from '@/components/client/TaskCalendar';
import TaskCategoryManagement from '@/components/admin/TaskCategoryManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import SmartSearchBar from '@/components/admin/SmartSearchBar';
import { useAdminActivity } from '@/hooks/useAdminActivity';

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const { logActivity } = useAdminActivity();

  // Use auth guard for continuous validation
  useAuthGuard();

  // Log admin login activity
  useEffect(() => {
    if (profile) {
      logActivity({
        activity_type: 'login',
        description: `Admin ${profile.full_name || profile.email} logged in`
      });
    }
  }, [profile, logActivity]);

  const handleLogout = async () => {
    try {
      logActivity({
        activity_type: 'logout',
        description: `Admin ${profile?.full_name || profile?.email} logged out`
      });
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleQuickAdd = (item: string) => {
    console.log('Quick add:', item);
    if (item === 'client') {
      setActiveTab('clients-add');
      setShowAddClientModal(true);
    }
    // Handle other quick add items here
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'user-management':
        return <UserManagement />;
      case 'clients-add':
      case 'clients-list':
        return <ClientManagement />;
      case 'clients-import':
        return <ClientImport />;
      case 'clients-bulk-edit':
        return <ClientBulkEdit />;
      case 'tasks-overview':
        return <AdminTaskOverview />;
      case 'tasks-list':
        return <AdminTasksList />;
      case 'tasks-calendar':
        return <TaskCalendar />;
      case 'tasks-categories':
        return <TaskCategoryManagement />;
      case 'tasks-settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Settings</h2>
            <p className="text-gray-600">Task configuration settings coming soon...</p>
          </div>
        );
      case 'system-settings':
        return <SystemSettings />;
      case 'analytics':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Analytics dashboard coming soon...</p>
          </div>
        );
      default:
        return (
          <>
            {/* Stats Overview */}
            <AdminDashboardStats />

            {/* Management Cards */}
            <AdminManagementCards 
              showAddClientModal={showAddClientModal}
              setShowAddClientModal={setShowAddClientModal}
              setActiveTab={setActiveTab}
            />

            {/* Recent Admin Activity */}
            <AdminRecentActivity />
          </>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center gap-4 flex-1 max-w-2xl">
                    <SidebarTrigger className="md:hidden" />
                    <SmartSearchBar onQuickAdd={handleQuickAdd} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <h1 className="text-lg font-semibold text-gray-900">
                        Admin Dashboard
                      </h1>
                      <p className="text-sm text-gray-600">
                        Welcome back, {profile?.full_name || profile?.email || 'Admin'}
                      </p>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {renderContent()}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
