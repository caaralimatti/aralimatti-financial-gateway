
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, BarChart3, UserPlus, Plus } from 'lucide-react';
import AddClientModal from './AddClientModal';

interface AdminManagementCardsProps {
  showAddClientModal: boolean;
  setShowAddClientModal: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const AdminManagementCards = ({ showAddClientModal, setShowAddClientModal, setActiveTab }: AdminManagementCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">Manage all users and roles</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => setActiveTab('user-management')}>
            Manage Users
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">System Settings</h3>
              <p className="text-sm text-gray-600">Configure system preferences</p>
            </div>
          </div>
          <Button className="w-full" variant="outline" onClick={() => setActiveTab('system-settings')}>
            System Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">View system analytics</p>
            </div>
          </div>
          <Button className="w-full" variant="outline" onClick={() => setActiveTab('analytics')}>
            View Analytics
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Client Management</h3>
              <p className="text-sm text-gray-600">Add and manage clients</p>
            </div>
          </div>
          <Button className="w-full" onClick={() => setShowAddClientModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </CardContent>
      </Card>

      <AddClientModal 
        open={showAddClientModal} 
        onOpenChange={setShowAddClientModal} 
      />
    </div>
  );
};

export default AdminManagementCards;
