
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminManagementCards from '@/components/admin/AdminManagementCards';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';
import AdminTaskOverview from '@/components/admin/AdminTaskOverview';
import UserManagement from '@/components/admin/UserManagement';
import ClientManagement from '@/components/admin/ClientManagement';
import ClientImport from '@/components/admin/ClientImport';
import ClientBulkEdit from '@/components/admin/ClientBulkEdit';
import AddClientModal from '@/components/admin/AddClientModal';
import AdminTasksList from '@/components/admin/AdminTasksList';
import TaskCategoryManagement from '@/components/admin/TaskCategoryManagement';
import ComplianceCalendarUpload from '@/components/admin/ComplianceCalendarUpload';
import DSCManagement from '@/components/admin/DSCManagement';
import AnnouncementsManagement from '@/components/admin/AnnouncementsManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import TaskCalendar from '@/components/admin/TaskCalendar';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import BillingDashboard from '@/components/admin/BillingDashboard';
import { Menu } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <AdminDashboardStats />
            <AdminManagementCards 
              setActiveTab={setActiveTab}
              showAddClientModal={showAddClientModal}
              setShowAddClientModal={setShowAddClientModal}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminRecentActivity />
              <AdminTaskOverview />
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'clients':
      case 'clients-add':
      case 'clients-list':
        return <ClientManagement activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'add-client':
        return <AddClientModal open={true} onOpenChange={() => setActiveTab('clients')} />;
      case 'import-clients':
        return <ClientImport />;
      case 'bulk-edit':
        return <ClientBulkEdit />;
      case 'task-overview':
        return <AdminTaskOverview />;
      case 'tasks':
        return <AdminTasksList />;
      case 'task-calendar':
        return <TaskCalendar />;
      case 'categories':
        return <TaskCategoryManagement />;
      case 'task-settings':
        return <ComplianceCalendarUpload />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'billing':
        return <BillingDashboard />;
      case 'dsc':
        return <DSCManagement />;
      case 'announcements':
        return <AnnouncementsManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return (
          <div className="space-y-6">
            <AdminDashboardStats />
            <AdminManagementCards 
              setActiveTab={setActiveTab}
              showAddClientModal={showAddClientModal}
              setShowAddClientModal={setShowAddClientModal}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminRecentActivity />
              <AdminTaskOverview />
            </div>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background w-full">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with toggle button */}
          <div className="flex items-center gap-2 p-4 border-b bg-background">
            <SidebarTrigger className="h-8 w-8" />
            <h1 className="text-lg font-semibold text-foreground">Admin Portal</h1>
          </div>
          
          {/* Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
