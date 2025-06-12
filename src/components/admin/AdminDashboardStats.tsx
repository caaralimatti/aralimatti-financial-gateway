
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BarChart3, Shield, Settings } from 'lucide-react';
import { useAdminStats } from '@/hooks/useAdminStats';
import WelcomeToast from '@/components/WelcomeToast';

const AdminDashboardStats = () => {
  const { stats, isLoading, error } = useAdminStats();

  if (error) {
    console.error('Error loading admin stats:', error);
  }

  return (
    <>
      <WelcomeToast />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                {isLoading ? (
                  <div className="w-8 h-6 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.totalUsers || 0}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                {isLoading ? (
                  <div className="w-8 h-6 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.activeClients || 0}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Staff Members</p>
                {isLoading ? (
                  <div className="w-8 h-6 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.staffMembers || 0}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-lg font-bold text-green-600">Online</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboardStats;
