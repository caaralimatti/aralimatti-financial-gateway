
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import UserManagement from '@/components/admin/UserManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import DSCManagement from '@/components/admin/DSCManagement';
import AnnouncementsManagement from '@/components/admin/AnnouncementsManagement';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';
import AdminManagementCards from '@/components/admin/AdminManagementCards';
import ClientManagement from '@/components/admin/ClientManagement';
import AdminTasksList from '@/components/admin/AdminTasksList';
import AdminTaskOverview from '@/components/admin/AdminTaskOverview';
import TaskCategoryManagement from '@/components/admin/TaskCategoryManagement';
import ComplianceCalendarUpload from '@/components/admin/ComplianceCalendarUpload';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'announcements':
        return <AnnouncementsManagement />;
      case 'dsc':
        return <DSCManagement />;
      case 'settings':
        return (
          <div className="space-y-6">
            <SystemSettings />
            <ComplianceCalendarUpload />
          </div>
        );
      case 'add-client':
        return <ClientManagement activeTab="clients-add" />;
      case 'clients':
        return <ClientManagement activeTab="clients-list" />;
      case 'import-clients':
        return <ClientManagement activeTab="clients-import" />;
      case 'bulk-edit':
        return <ClientManagement activeTab="clients-bulk-edit" />;
      case 'task-overview':
        return <AdminTaskOverview />;
      case 'tasks':
        return <AdminTasksList />;
      case 'task-calendar':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Task Calendar</h1>
            <p className="text-gray-600">Task calendar view with compliance deadlines integration will be implemented here.</p>
          </div>
        );
      case 'categories':
        return <TaskCategoryManagement />;
      case 'task-settings':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Task Settings</h1>
            <ComplianceCalendarUpload />
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
