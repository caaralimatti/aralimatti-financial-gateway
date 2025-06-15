
import React from 'react';
import ClientSidebar from '@/components/client/ClientSidebar';
import UserProfile from '@/components/client/UserProfile';

const ClientUserProfile = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClientSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
              <p className="text-gray-600">Manage your account information and security settings</p>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <UserProfile />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientUserProfile;
