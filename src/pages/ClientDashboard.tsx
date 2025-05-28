
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileText, Download, User, LogOut, Calendar, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
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
                Client Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {profile?.full_name || profile?.email}
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
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-600">View and edit your information</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {profile?.full_name || 'Not set'}</p>
              <p><span className="font-medium">Email:</span> {profile?.email}</p>
              <p><span className="font-medium">Role:</span> Client</p>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Documents</h3>
                <p className="text-sm text-gray-600">Access your financial documents</p>
              </div>
            </div>
            <Link to="/documents">
              <Button className="w-full" variant="outline">
                View Documents
              </Button>
            </Link>
          </div>

          {/* Downloads Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Downloads</h3>
                <p className="text-sm text-gray-600">Download reports and statements</p>
              </div>
            </div>
            <Link to="/documents">
              <Button className="w-full" variant="outline">
                View Downloads
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Request Document
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              View Tax Returns
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">New document uploaded</p>
                <p className="text-xs text-gray-600">Tax Return 2023 - 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">Message from your accountant</p>
                <p className="text-xs text-gray-600">Regarding quarterly filing - 1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;
