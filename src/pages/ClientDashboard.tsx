
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import ClientSidebar from '@/components/client/ClientSidebar';
import DocumentListCard from '@/components/client/DocumentListCard';
import MyTasks from '@/components/client/MyTasks';
import TaskCalendar from '@/components/client/TaskCalendar';
import ClientDSCManagement from '@/components/client/ClientDSCManagement';
import ClientAnnouncements from '@/components/client/ClientAnnouncements';
import { useAuth } from '@/contexts/AuthContext';

const ClientDashboard = () => {
  const { profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClientSidebar />
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
