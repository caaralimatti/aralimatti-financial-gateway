
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import ClientSidebar from '@/components/client/ClientSidebar';
import MyTasks from '@/components/client/MyTasks';
import { useAuth } from '@/contexts/AuthContext';

const ClientTasksPage = () => {
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
            <MyTasks />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ClientTasksPage;
