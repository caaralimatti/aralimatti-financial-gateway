
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaffTaskDashboard from '@/components/staff/StaffTaskDashboard';

const StaffDashboard = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <StaffTaskDashboard />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {profile?.full_name || profile?.email}!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Here's an overview of your current tasks and activities.
                </p>
              </CardContent>
            </Card>

            {/* Task Dashboard */}
            <StaffTaskDashboard />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-semibold text-gray-900">Staff Dashboard</h1>
              <nav className="flex space-x-4">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('dashboard')}
                >
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'tasks' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('tasks')}
                >
                  My Tasks
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Welcome back, {profile?.full_name || profile?.email || 'Staff'}
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffDashboard;
