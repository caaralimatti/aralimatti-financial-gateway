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
import BulkInvoices from '@/components/admin/billing/BulkInvoices';
import AdminPermissionsManagement from '@/components/admin/AdminPermissionsManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUserPermissions } from '@/hooks/useAdminPermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const { profile } = useAuth();
  const { data: permissions = {} } = useCurrentUserPermissions();

  const isSuperAdmin = profile?.role === 'super_admin';
  const isAdmin = profile?.role === 'admin';

  // Helper function to check if a module is enabled
  const isModuleEnabled = (moduleName: string): boolean => {
    if (isSuperAdmin) return true;
    if (!isAdmin) return false;
    return permissions[moduleName] !== false;
  };

  // Access control component
  const ProtectedContent = ({ module, children }: { module?: string; children: React.ReactNode }) => {
    if (!module || isModuleEnabled(module)) {
      return <>{children}</>;
    }
    
    return (
      <Alert className="m-6">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this module. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  };

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
        return (
          <ProtectedContent module="user_management">
            <UserManagement />
          </ProtectedContent>
        );
      case 'admin-permissions':
        return isSuperAdmin ? (
          <AdminPermissionsManagement />
        ) : (
          <Alert className="m-6">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Only Super Admins can access this feature.
            </AlertDescription>
          </Alert>
        );
      case 'clients':
      case 'clients-add':
      case 'clients-list':
        return (
          <ProtectedContent module="client_management_list">
            <ClientManagement activeTab={activeTab} setActiveTab={setActiveTab} />
          </ProtectedContent>
        );
      case 'add-client':
        return (
          <ProtectedContent module="client_management_add">
            <AddClientModal open={true} onOpenChange={() => setActiveTab('clients')} />
          </ProtectedContent>
        );
      case 'import-clients':
        return (
          <ProtectedContent module="client_management_import">
            <ClientImport />
          </ProtectedContent>
        );
      case 'bulk-edit':
        return (
          <ProtectedContent module="client_management_bulk_edit">
            <ClientBulkEdit />
          </ProtectedContent>
        );
      case 'task-overview':
        return (
          <ProtectedContent module="task_management_overview">
            <AdminTaskOverview />
          </ProtectedContent>
        );
      case 'tasks':
        return (
          <ProtectedContent module="task_management_overview">
            <AdminTasksList />
          </ProtectedContent>
        );
      case 'task-calendar':
        return (
          <ProtectedContent module="task_management_calendar">
            <TaskCalendar />
          </ProtectedContent>
        );
      case 'categories':
        return (
          <ProtectedContent module="task_management_categories">
            <TaskCategoryManagement />
          </ProtectedContent>
        );
      case 'task-settings':
        return (
          <ProtectedContent module="task_management_settings">
            <ComplianceCalendarUpload />
          </ProtectedContent>
        );
      case 'analytics':
        return (
          <ProtectedContent module="analytics">
            <AnalyticsDashboard />
          </ProtectedContent>
        );
      case 'billing':
        return (
          <ProtectedContent module="billing_invoices_list">
            <BillingDashboard />
          </ProtectedContent>
        );
      case 'bulk-invoices':
        return (
          <ProtectedContent module="billing_invoices_list">
            <BulkInvoices />
          </ProtectedContent>
        );
      case 'dsc':
        return (
          <ProtectedContent module="dsc_management">
            <DSCManagement />
          </ProtectedContent>
        );
      case 'announcements':
        return (
          <ProtectedContent module="announcements">
            <AnnouncementsManagement />
          </ProtectedContent>
        );
      case 'settings':
        return (
          <ProtectedContent module="system_settings">
            <SystemSettings />
          </ProtectedContent>
        );
      case 'manage-documents':
        // Permission check: reuse client_management_list, like Client List.
        return (
          <ProtectedContent module="client_management_list">
            <div className="flex flex-col items-center justify-center h-full p-8">
              <h1 className="text-2xl font-semibold mb-2">Client Document Management</h1>
              <p className="text-muted-foreground">This page is under construction, for managing client documents.</p>
            </div>
          </ProtectedContent>
        );
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
