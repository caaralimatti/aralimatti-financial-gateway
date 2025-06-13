
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import ClientSidebar from '@/components/client/ClientSidebar';
import DocumentListCard from '@/components/client/DocumentListCard';
import MyTasks from '@/components/client/MyTasks';
import TaskCalendar from '@/components/client/TaskCalendar';
import ClientDSCManagement from '@/components/client/ClientDSCManagement';
import ClientAnnouncements from '@/components/client/ClientAnnouncements';
import { useAuth } from '@/contexts/AuthContext';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { profile } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'documents':
        return (
          <DocumentListCard 
            title="My Documents"
            description="Access your important documents and files"
            fileCount={0}
            lastUpdated="2024-01-01"
          />
        );
      case 'tasks':
        return <MyTasks />;
      case 'calendar':
        return <TaskCalendar />;
      case 'dsc':
        return <ClientDSCManagement />;
      case 'profile':
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-gray-600">Profile management coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || 'Client'}!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DocumentListCard 
                title="Recent Documents"
                description="Your recently uploaded or modified documents"
                fileCount={0}
                lastUpdated="2024-01-01"
              />
              <MyTasks />
            </div>
            <ClientAnnouncements />
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
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

export default ClientDashboard;
