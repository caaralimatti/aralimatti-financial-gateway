
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserManagement from '@/components/admin/UserManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import DSCManagement from '@/components/admin/DSCManagement';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';
import AdminManagementCards from '@/components/admin/AdminManagementCards';
import ClientManagement from '@/components/admin/ClientManagement';
import AdminTasksList from '@/components/admin/AdminTasksList';
import AdminTaskOverview from '@/components/admin/AdminTaskOverview';
import TaskCategoryManagement from '@/components/admin/TaskCategoryManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'user-management':
        return <UserManagement />;
      case 'dsc-management':
        return <DSCManagement />;
      case 'system-settings':
        return <SystemSettings />;
      case 'clients-add':
      case 'clients-list':
      case 'clients-import':
      case 'clients-bulk-edit':
        return <ClientManagement activeTab={activeTab} />;
      case 'tasks-overview':
        return <AdminTaskOverview />;
      case 'tasks-list':
        return <AdminTasksList />;
      case 'tasks-categories':
        return <TaskCategoryManagement />;
      case 'analytics':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-gray-600">Analytics dashboard coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <AdminManagementCards 
              showAddClientModal={showAddClientModal}
              setShowAddClientModal={setShowAddClientModal}
              setActiveTab={setActiveTab}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AdminDashboardStats />
              </div>
              <div className="lg:col-span-1">
                <AdminRecentActivity />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, Admin
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

export default AdminDashboard;
