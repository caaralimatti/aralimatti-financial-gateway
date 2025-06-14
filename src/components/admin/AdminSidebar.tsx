
import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import AdminSidebarHeader from './sidebar/AdminSidebarHeader';
import AdminSidebarContent from './sidebar/AdminSidebarContent';
import AdminSidebarFooter from './sidebar/AdminSidebarFooter';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <Sidebar variant="sidebar" collapsible="offcanvas">
      <AdminSidebarHeader />
      <AdminSidebarContent activeTab={activeTab} setActiveTab={setActiveTab} />
      <AdminSidebarFooter />
    </Sidebar>
  );
};

export default AdminSidebar;
