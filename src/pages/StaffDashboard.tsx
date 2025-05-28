
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Users, FileText, Upload, Settings, LogOut } from 'lucide-react';

const StaffDashboard = () => {
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Staff Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {profile?.full_name || profile?.email} ({profile?.role})
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Client Management Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Client Management</h3>
                <p className="text-sm text-gray-600">Manage client accounts and information</p>
              </div>
            </div>
            <Button className="w-full">
              Manage Clients
            </Button>
          </div>

          {/* Document Upload Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Document Upload</h3>
                <p className="text-sm text-gray-600">Upload documents for clients</p>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Upload Documents
            </Button>
          </div>

          {/* Reports Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Reports</h3>
                <p className="text-sm text-gray-600">Generate and view reports</p>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              View Reports
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Document uploaded for Client A</p>
                <p className="text-sm text-gray-600">Tax return processed</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Meeting scheduled with Client B</p>
                <p className="text-sm text-gray-600">Financial consultation</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Audit report completed</p>
                <p className="text-sm text-gray-600">Annual audit for Company C</p>
              </div>
              <span className="text-sm text-gray-500">3 days ago</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
