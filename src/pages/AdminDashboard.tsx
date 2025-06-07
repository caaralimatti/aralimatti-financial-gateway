
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LogOut } from 'lucide-react';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import AdminManagementCards from '@/components/admin/AdminManagementCards';
import AdminRecentActivity from '@/components/admin/AdminRecentActivity';

const AdminDashboard = () => {
  const { profile, signOut } = useAuth();
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
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
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <AdminDashboardStats />

          {/* Management Cards */}
          <AdminManagementCards 
            showAddClientModal={showAddClientModal}
            setShowAddClientModal={setShowAddClientModal}
          />

          {/* Recent Admin Activity */}
          <AdminRecentActivity />
        </main>
      </div>
    </TooltipProvider>
  );
};

export default AdminDashboard;
